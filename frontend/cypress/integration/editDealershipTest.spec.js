describe('Edit Dealership Test', () => {
    it('Visits the dealerships page and modifying a selected dealership', () => {
        cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
        cy.visit('/#/dealerships')

        cy.get("tr").eq(3)
        .click()

        cy.contains("List of staff accounts")

        cy.get("#edit-dealership")
        .click()

        cy.get("[placeholder='Dealership Name']")
        .clear()
        .type("Dealership #10")
        .should('have.value', 'Dealership #10')

        cy.get("[placeholder='Dealership Description']")
        .clear()
        .type("new dealership description")
        .should('have.value', 'new dealership description')
        
        cy.get("#save-dealership-changes")
        .click()
        
        cy.contains("Dealership #10")
    })
})