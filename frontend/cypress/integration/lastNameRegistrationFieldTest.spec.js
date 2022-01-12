describe('Last Name Registration Field Test', () => {
    it('Verifies the last name text field component', () => {
      //Visiting the registration page
      cy.visit('/#/pages/register')
      cy.contains('Register new account');

      //Filling out the necessary fields to create a new user
      cy.get("#last-name-txt-field")
      .type('Last')
      .should('have.value', 'Last')
  })
})