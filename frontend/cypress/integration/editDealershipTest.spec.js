describe('Edit Dealership Test', () => {
    it('Visits the dealerships page and modifying a selected dealership', () => {
        //Setting the token in the local storage to be able to access dealerships page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
        cy.visit('/#/dealerships')
        //Loading the dealership takes a slight amount of time, so without this wait the test fails as cy.get("tr").eq(3) will fail
        cy.wait(1000)         
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
