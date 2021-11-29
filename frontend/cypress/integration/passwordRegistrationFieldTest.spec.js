describe('Password Registration Field Test', () => {
    it('Verifies the password text field component', () => {
      //Visiting the registration page
      cy.visit('/#/pages/register')
      cy.contains('Register new account');

      //Filling out the necessary fields to create a new user
      cy.get("#password-txt-field")
      .type('Password')
      .should('have.value', 'Password')
  })
})