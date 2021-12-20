describe('Email Registration Field Test', () => {
    it('Verifies the email text field component', () => {
      //Visiting the registration page
      cy.visit('/#/pages/register')
      cy.contains('Register new account');

      //Filling out the necessary fields to create a new user
      cy.get("#email-txt-field")
      .type('Email')
      .should('have.value', 'Email')
  })
})