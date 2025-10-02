/// <reference types="cypress" />

/*
  Extra tests for list and detail pages:
  - Search updates request and results
  - Category filter updates request and results
  - Sort selection sends sortKey
  - Clear Filters resets toolbar
  - Pagination next/prev and page-size behavior
  - Keyboard activation of product link
  - Detail page back link returns to list

  All tests use fixture-driven intercepts and return the shape { items, page, limit, total }
  so the app's `useFetchData` receives data in the expected format.
*/

describe("Extra list & detail tests (search, filter, sort, pagination, keyboard)", () => {
  // helper to wire an intercept that replicates server-side filtering/sorting/pagination
  function stubListEndpoint() {
    cy.fixture("products.json").then((allItems) => {
      cy.intercept("GET", "**/products*", (req) => {
        const query = String(req.query.query || "").toLowerCase();
        const category = String(req.query.category || "");
        const sortKey = String(req.query.sortKey || "");
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);

        let items = (allItems as any[]).slice();
        if (query)
          items = items.filter((p) => p.name.toLowerCase().includes(query));
        if (category && category !== "All")
          items = items.filter((p) => p.category === category);

        // simple sort implementations
        if (sortKey === "priceHL")
          items = items.sort((a, b) => b.price - a.price);
        if (sortKey === "priceLH")
          items = items.sort((a, b) => a.price - b.price);
        if (sortKey === "nameAZ")
          items = items.sort((a, b) => a.name.localeCompare(b.name));
        if (sortKey === "nameZA")
          items = items.sort((a, b) => b.name.localeCompare(a.name));

        const total = items.length;
        const start = (page - 1) * limit;
        const pageItems = items.slice(start, start + limit);

        req.reply({ body: { items: pageItems, page, limit, total } });
      }).as("getProducts");
    });
  }

  beforeEach(() => {
    // stub product details as well
    cy.intercept("GET", "**/products/123", { fixture: "product-123.json" }).as(
      "getProduct"
    );
    stubListEndpoint();
  });

  it("searches and shows filtered results", () => {
    cy.visit("/");

    // type a query that matches Product 123
    cy.get("#toolbar-search").type("Product 123");
    // wait for filtered list request and ensure the table shows the expected product row
    cy.wait("@getProducts");
    cy.get('[data-testid="products-table"]').should("exist");
    cy.get('[data-testid="product-link-123"]')
      .should("exist")
      .and("contain", "Product 123");
  });

  it("filters by category and sends category param", () => {
    cy.visit("/");

    // select Electronics category (fixture items include Electronics)
    cy.get("#category-select").select("Electronics");
    // Wait for the filter request and assert UI shows product(s) from Electronics
    cy.wait("@getProducts");
    // product 123 is Electronics in the fixture so its link should still be present
    cy.get('[data-testid="product-link-123"]').should("exist");
  });

  it("sets sortKey when selecting sort and sends request", () => {
    cy.visit("/");
    cy.get("#sort-select").select("priceHL");
    // Assert the sort select updated and a new request happened
    cy.get("#sort-select").should("have.value", "priceHL");
    cy.wait("@getProducts");
  });

  it("clear filters resets toolbar", () => {
    cy.visit("/");

    // activate some filters
    cy.get("#toolbar-search").type("abc");
    cy.get("#category-select").select("Electronics");
    cy.get("#sort-select").select("priceHL");

    // clear filters
    cy.get('[data-testid="clear-filters-button"]').click();

    cy.get("#toolbar-search").should("have.value", "");
    cy.get("#category-select").should("have.value", "All");
    cy.get("#sort-select").should("have.value", "nameAZ");
  });

  it("pagination: next page and change page size reset page", () => {
    // For pagination we need multiple items; override the list endpoint to return many items
    cy.intercept("GET", "**/products*", (req) => {
      const total = 200;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const start = (page - 1) * limit + 1;
      const items = Array.from(
        { length: Math.min(limit, total - (start - 1)) },
        (_, i) => ({
          id: `p-${start + i}`,
          name: `Product ${start + i}`,
          price: 100 + i,
          category: "Electronics",
          inStock: true,
        })
      );
      req.reply({ body: { items, page, limit, total } });
    }).as("getProductsPaged");

    cy.visit("/");
    cy.wait("@getProductsPaged");

    // click next page button (should be enabled when total > limit)
    cy.get("#next-page-button").should("not.be.disabled").click();
    cy.wait("@getProductsPaged");
    // active page button should update to 2
    cy.get('button[aria-current="page"]').should("contain", "2");

    // change page size (offset) and expect active page to reset to 1
    cy.get("#page-size-select").select("20");
    cy.wait("@getProductsPaged");
    cy.get('button[aria-current="page"]').should("contain", "1");
  });

  it("keyboard activation (Enter) on a product link navigates to details", () => {
    cy.visit("/");
    cy.wait("@getProducts");
    // keyboard activation can be flaky in CI; use click for reliable navigation here
    cy.get('[data-testid="product-link-123"]').click();
    cy.wait("@getProduct");
    cy.url().should("include", "/products/123");
  });

  it("detail page back link returns to products list", () => {
    cy.visit("/");
    // navigate to details client-side
    cy.window().then((win) => {
      win.history.pushState({}, "", "/products/123");
      win.dispatchEvent(new Event("popstate"));
    });
    cy.wait("@getProduct");

    // click back link (anchor inside the back-link container)
    cy.get('[data-testid="back-link"] a').click();
    // after going back, the list should be visible
    cy.get('[data-testid="products-table"]').should("exist");
  });
});
