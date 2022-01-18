describe('Create Dealership Test', () => {
    it('Visits the dealerships page and creating a new dealership', () => {
      //Setting the token in the local storage to be able to access dealerships page
      cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
      cy.visit('/#/dealerships')
      cy.get("#add-new-dealership")
      .click()
      //Filling out the necessary information to create a new dealership
      cy.get("[placeholder='Dealership Name']")
      .type("New dealership")
      .should('have.value', 'New dealership')

      cy.get("[placeholder='Dealership Description']")
      .type("New dealership created")
      .should('have.value', 'New dealership created')

      cy.get("#create-dealership")
      .click()

      cy.url().should('include', '#/dealerships')
      //Verifying that the new dealership is now visible
      cy.contains("New dealership created");

    })
  })
