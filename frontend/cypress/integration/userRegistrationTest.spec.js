describe('User Registration Test', () => {
    it('Visits the registration page and registers a new user successfully', () => {
      //Visiting the registration page
      cy.visit('/#/pages/register')
      cy.contains('Register new account');

      //Filling out the necessary fields to create a new user
      cy.get("[placeholder='ex. John']")
      .type('test')
      .should('have.value', 'test')
      
      cy.get("[placeholder='ex. Doe']")
      .type('test')
      .should('have.value', 'test')

      cy.get("[placeholder='ex. john.doe@mail.com']")
      .type('test@gmail.com')
      .should('have.value', 'test@gmail.com')

      cy.get("[placeholder='password']")
      .type('password123')
      .should('have.value', 'password123')

      cy.get("[placeholder='confirm password']")
      .type('password123')
      .should('have.value', 'password123')

      cy.get("button.btn.btn-primary")
      .click()

      //Validating that the page was redirected upon a successful registration of an admin
      cy.url().should('include', '#/dashboard')
 
    })
  })