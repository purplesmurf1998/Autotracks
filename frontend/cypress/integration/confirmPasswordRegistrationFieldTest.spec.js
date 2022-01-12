describe('Confirm Password Registration Field Test', () => {
    it('Verifies the confirm password text field component', () => {
      //Visiting the registration page
      cy.visit('/#/pages/register')
      cy.contains('Register new account');

      //Filling out the necessary fields to create a new user
      cy.get("#confirm-password-txt-field")
      .type('ConfirmedPassword')
      .should('have.value', 'ConfirmedPassword')
  })
})