//This test does not function with some of the core ui windows
describe('Mark Missing Test', () => {
    it('Selects a vehicles and labels it missing', () => {
        //Setting the token in the local storage to be able to access inventory page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
        cy.visit('#/inventory')
        //Loading from the database takes a slight amount of time
        cy.wait(1000)
 
        //Change the dealership
        cy.get("[id='dealership-select-cmb']").select('My First Dealership')
        cy.wait(2000)
        //choose a vehicle
        cy.get("tr").eq(3).click()

        //mark missing
        cy.contains("Select an action").click()
        cy.contains("Missing / Misplaced").click()

        cy.get("[class='close']").eq(0).click()
        cy.get("[name='header-nav-link']").click()
    })
})