describe('Edit Dealership Test', () => {
    it('Visits the dealerships page and modifying a selected dealership', () => {
        //Setting the token in the local storage to be able to access dealerships page
        cy.setLocalStorage('autotracksAuthToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg3MWU2NmFjMzNjYmE1N2JmMWQ4MTEiLCJpYXQiOjE2MzYzMTYwMTAsImV4cCI6MTYzODkwODAxMH0.rXnYhgWxnX3koe04r0MV_iASdQ_qPW01wnYnNwZ3QAg')
        cy.visit('/#/dealerships')
        //Selecting a dealership
        cy.get("tr").eq(3)
        .click()

        cy.contains("List of staff accounts")
        //Editing the selected dealership
        cy.get("#edit-dealership")
        .click()
        //Modifying the selected dealership name and description
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
        //Verifying that the modified name is displayed and visible
        cy.contains("Dealership #10")
    })
})