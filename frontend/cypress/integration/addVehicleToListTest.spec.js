describe('Add Vehicle to  List Test', () => {
    it('Visits the vehicle list page and modifies a selected vehicle', () => {
        //Setting the token in the local storage to be able to access inventory page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDI1MjYwNjIsImV4cCI6MTY0NTExODA2Mn0.VJ_fSlQS8wS4tjPSOGGmmTRk0RK3Jnkbu-m5lc-kLhE')
        cy.visit('#/vehicle-lists')
        //Loading from the database takes a slight amount of time
        cy.wait(2000)         
        //create a vehicle list
        cy.get("tr").eq(3).click()
        cy.contains("Add vehicles to list").click()
        cy.wait(2000)
        //Choose vehicle
        cy.get("tr").eq(3).click()
        //Click add to list
        cy.contains("Select an action").click()
        cy.contains("Add to list").click()

        cy.get("[name='select-dealership']")
        .select("List with a dealership")
        .should('have.value', '0')

        cy.get("[name='add-button']").click()

        cy.visit('#/vehicle-lists')
        //Loading from the database takes a slight amount of time
        cy.wait(2000)         
        //create a vehicle list
        cy.get("tr").eq(2).click()

        cy.contains('12345678913')
        


    })
})
