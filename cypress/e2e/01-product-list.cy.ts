/// <reference types="cypress" />

/*
  Test #1 — Product List (load, basic accessibility, navigation)

  Why this test is meaningful:
  - It verifies the full rendered list UI is populated from the network layer (we stub it
    with a fixture so the test is deterministic).
  - It checks a few accessibility hooks (table and toolbar roles) and that product links
    are navigable to the details page.
  - Talking points for interview: use of `cy.intercept` to stub network responses, testing
    integration between UI and network, and asserting ARIA attributes for accessibility.
*/

describe("Product List - load, a11y, navigation", () => {
  beforeEach(() => {
    // stub list and detail endpoints with fixtures so tests are deterministic
    // use cy.fixture to wrap the array into the { items, page, limit, total } shape
    cy.fixture("products.json").then((items) => {
      cy.intercept("GET", "**/products*", (req) => {
        req.reply({
          body: { items, page: 1, limit: 10, total: (items as any).length },
        });
      }).as("getProducts");
    });

    cy.intercept("GET", "**/products/123", { fixture: "product-123.json" }).as(
      "getProduct"
    );
  });

  it("renders the list and navigates to product details", () => {
    cy.visit("/");

    // Wait for the app to fetch products and render the table
    cy.wait("@getProducts");
    cy.get('[data-testid="products-table"]').should("exist");

    // Basic accessibility checks: toolbar & table roles
    cy.get('[role="search"]').should("exist");
    cy.get('table[aria-label="Products table"]').should("exist");

    // Click the known product link (fixture contains an item with id 123)
    cy.get('[data-testid="product-link-123"]').should("exist").click();

    cy.wait("@getProduct");
    cy.url().should("include", "/products/123");

    // Product details should render
    cy.get('[data-testid="product-info"]').should("exist");
    cy.get('[data-testid="product-price"]').should("contain", "$");
  });
});
