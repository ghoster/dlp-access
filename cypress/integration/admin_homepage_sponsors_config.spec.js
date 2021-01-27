const USERNAME = "devtest";
const PASSWORD = Cypress.env("password");

describe("Update sponsors fields and revert", function () {
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
            .find(":nth-child(4) > a")
            .contains("Homepage Config")
            .click();
        cy.url({ timeout: 2000 }).should("include", "/siteAdmin");
    });

    it("Updates first sponsor URL", () => {
        cy.get("input[value='edit']")
            .parent()
            .click();
        cy.get("#s0_link")
            .clear()
            .type("https://www.lib.vt.edu");
        cy.contains("Update Config").click();
        cy.contains("URL: https://www.lib.vt.edu", { timeout: 2000 }).should("be.visible");
    });

    it("Reverses update", () => {
        cy.get("input[value='edit']")
            .parent()
            .click();
        cy.get("#s0_link")
            .clear()
            .type("https://clir.org/");
        cy.contains("Update Config").click();
        cy.contains("URL: https://clir.org/", { timeout: 2000 }).should("be.visible");
    });
    
    it("Adds new sponsor with image", () => {
        cy.get("input[value='edit']")
            .parent()
            .click();
        const imgPath = "sitecontent/sponsor4.png";
        cy.get("button[aria-label='Add sponsor']", { timeout: 2000 }).click();
        cy.get(
            "#sponsor3_form > section > div.fileUploadField > input[type=file]", { timeout: 2000 }
        )
            .eq(0)
            .attachFile(imgPath)
            .trigger("change", { force: true });
        cy.get(
            "#sponsor3_form > section > div.fileUploadField > button.uploadButton"
        ).click({ force: true });
        cy.get("#s3_alt", { timeout: 2000 }).type("Virginia Tech");
        cy.get("#s3_link").type("https://vt.edu");
        cy.contains("Update Config").click();
        cy.contains("Sponsor 4", { timeout: 2000 }).should("be.visible");
        cy.contains(
            "Source: sponsors/sponsor4.png"
        ).should("be.visible");
        cy.contains("Alt text: Virginia Tech").should("be.visible");
        cy.contains("URL: https://vt.edu").should("be.visible");
    })

    it("Removes new sponsor", () => {
        cy.get("input[value='edit']")
            .parent()
            .click();
        cy.get(
            "#sponsor3_form > section > button", { timeout: 2000 }
        ).click()
        cy.contains("Update Config").click();
        cy.contains("Sponsor 4", { timeout: 2000 }).should("not.exist");
    })

    afterEach("User signout:", () => {
        cy.get("amplify-sign-out")
            .find(selectors.signOutButton, { includeShadowDom: true })
            .contains("Sign Out")
            .click({ force: true });
    })
});    

export const selectors = {
  usernameInput: '[data-test="sign-in-username-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  signOutButton: '[data-test="sign-out-button"]',
};
