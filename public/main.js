(async () => {
    const toDo = document.querySelector(".todo-container")
    const formField = document.querySelectorAll(".form-field input")  
    const modal = document.querySelector(".modal")

    let allEvents = await (await fetch("http://localhost:3000/event")).json();
    let method = "POST"; 
    let idEvent;

    document.querySelector(".add-event").addEventListener("click", () => modal.style.display = 'flex')

    document.querySelector("button.submit-button").addEventListener("click", async () => {
        const requestOptions = {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: formField[0].value, 
                author: formField[1].value,
            })
        }

        const event = await (await fetch("http://localhost:3000/event" + (method === "POST" ? "" : "/" + idEvent), requestOptions)).json()
        modal.style.display = 'none'

        if(method == "PUT") updateEventFetched()
        else allEvents.events.push(event)
        displayEvents()

        method = "POST"  
    })

    const updateEventFetched = () => {
        const index = allEvents.events.findIndex(event => event.id == idEvent)
        allEvents.events[index].name = formField[0].value;
        allEvents.events[index].author = formField[1].value;
    }

    const displayEvents = () => {
        toDo.innerHTML = ''
        allEvents.events.forEach(event => {
            toDo.innerHTML += `
                <div id="${event.id}" class="event">
                    <p><span>Name: </span>${event.name}</p>
                    <p><span>Author: </span>${event.author}</p>
                    <div>
                        <button class="delete-event">Delete</button>
                        <button class="update-event">Udpate</button>
                    </div>
                </div>
            `
        })   

        const deleteEvent = async (el) => {
            await (await fetch("http://localhost:3000/event/" + el.parentNode.parentNode.id, { method: 'DELETE' })).json();
            allEvents.events = allEvents.events.filter(event => event.id != el.parentNode.parentNode.id)
            displayEvents()
        }

        const updateEvent = el => {
            method = 'PUT'
            idEvent = el.parentNode.parentNode.id
            modal.style.display = 'flex'
            const eventUpdate = allEvents.events.filter(event => event.id == idEvent)[0]

            formField[0].value = eventUpdate.name;
            formField[1].value = eventUpdate.author;
        }

        document.querySelectorAll(".delete-event").forEach(el => el.addEventListener("click", () => deleteEvent(el))) 
        document.querySelectorAll(".update-event").forEach(el => el.addEventListener("click", () => updateEvent(el)))
    }

    displayEvents()
})();