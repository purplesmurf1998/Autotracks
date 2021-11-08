describe('Create Dealership Test', () => {
    it('Visits the dealerships page and creating a new dealership', () => {
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
      cy.visit('/#/dealerships')

      cy.get("#add-new-dealership")
      .click()

      cy.get("[placeholder='Dealership Name']")
      .type("New dealership")
      .should('have.value', 'New dealership')

      cy.get("[placeholder='Dealership Description']")
      .type("New dealership created")
      .should('have.value', 'New dealership created')

      cy.get("#create-dealership")
      .click()

      cy.url().should('include', '#/dealerships')

      cy.contains("New dealership created");
        
    })
  })