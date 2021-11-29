describe('Confirm Registration Back Button Test', () => {
    it('Verifies the confirm password text field component', () => {
      //Visiting the registration page
      cy.visit('/#/pages/register')
      cy.contains('Register new account');

      //Filling out the necessary fields to create a new user
      cy.get("#registration-back-btn")
      .click()

      //Validating that the page was redirected upon a successful registration of an admin
      cy.url().should('include', '/login')
  })
})