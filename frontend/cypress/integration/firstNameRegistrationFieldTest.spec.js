describe('First Name Registration Field Test', () => {
    it('Verifies the field component', () => {
      //Visiting the registration page
      cy.visit('/#/pages/register')
      cy.contains('Register new account');

      //Filling out the necessary fields to create a new user
      cy.get("#first-name-txt-field")
      .type('First')
      .should('have.value', 'First')
    })
})