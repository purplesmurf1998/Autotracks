describe('Confirm Registration Button Test', () => {
    it('Verifies the confirm registration button component', () => {
      //Visiting the registration page
      cy.visit('/#/pages/register')
      cy.contains('Register new account');

      //Filling out the necessary fields to create a new user
      cy.get("#complete-registration-btn")
      .click()
  })
})