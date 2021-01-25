const USERNAME = "devtest";
const PASSWORD = Cypress.env("password");

describe("Updates mirador config fields and reverts", function() {
  beforeEach(() => {
    cy.visit("/siteAdmin");
    cy.get("amplify-authenticator")
      .find(selectors.usernameInput, {
        includeShadowDom: true,
      })
      .type(USERNAME);

    cy.get("amplify-authenticator")
      .find(selectors.signInPasswordInput, {
        includeShadowDom: true,
      })
      .type(PASSWORD, { force: true });

    cy.get("amplify-authenticator")
      .find(selectors.signInSignInButton, {
        includeShadowDom: true,
      })
      .first()
      .find("button[type='submit']", { includeShadowDom: true })
      .click({ force: true });

    cy.get("#content-wrapper > div > div > ul")
      .find(":nth-child(9) > a")
      .contains("Mirador Viewer")
      .click();
    cy.url({ timeout: 5000 }).should("include", "/siteAdmin");
  });

  it("Updates theme and reverses update", () => {
    cy.on("uncaught:exception", (err, runnable) => {
      expect(err.message).to.include("Cannot read property");
      done();
      return false;
    });
    cy.wait(5000);
    cy.get("input[value='edit']")
      .parent()
      .click();
    cy.get("#selectedTheme", { timeout: 5000 }).select("Dark");
    cy.contains("Update Config").click();
    cy.contains("Selected theme: dark", { timeout: 2000 }).should(
      "be.visible");
    cy.get("input[value='edit']")
      .parent()
      .click();
    cy.get("#selectedTheme").select("Light");
    cy.contains("Update Config").click();
    cy.contains("Selected theme: light", {
      timeout: 2000,
    }).should("be.visible");
  });

  afterEach("User signout:", () => {
    cy.get("amplify-sign-out")
      .find(selectors.signOutButton, { includeShadowDom: true })
      .contains("Sign Out")
      .click({ force: true });
  });
});

export const selectors = {
  usernameInput: '[data-test="sign-in-username-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  signOutButton: '[data-test="sign-out-button"]',
};
