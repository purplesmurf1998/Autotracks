describe('Marking Vehicle Delivered Test', () => {
    it('Visits the transactions page and marks a vehicle delivered', () => {
        //Setting the token in the local storage to be able to access inventory page
        cy.setLocalStorage('autotracksAuthToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE3YjlkMjUzMmU5MTk4YjI0ZjNhODgiLCJpYXQiOjE2NDg5NzYyNzgsImV4cCI6MTY1MTU2ODI3OH0.jr3dlo-sY2bjgYHiDRJ0xD6xImfaxeS9zxvMoUf-1d0')
        cy.visit('#/transactions')
        //Loading from the database takes a slight amount of time
        cy.wait(2000)         
        //choose a vehicle
        cy.get("tr").eq(3).click()

        //mark delivered
        cy.contains("Mark as Delivered").click()
        


    })
})