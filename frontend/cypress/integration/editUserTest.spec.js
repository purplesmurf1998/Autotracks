describe('Edit User Test', () => {
    it('Visits the dealerships page and modifying user information for a given dealership', () => {
      cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
      cy.visit('/#/dealerships')
        cy.get("tr").eq(3)
        .click()

        cy.contains("List of staff accounts")

        cy.get("#618800e83c70133a04cea4ce").should('exist')
        .click()

        cy.contains("abdul@gmail.com") 

        cy.get("#edit-user-acc")
        .click()

        cy.get("#first-name")
        .clear()
        .type("Cedrik")

        cy.get("#last-name")
        .clear()
        .type("Dubois")

        cy.get("#save-user-changes")
        .click()

        cy.url().should('include', '#/dealerships')

        cy.contains("Cedrik Dubois")
    })
  })