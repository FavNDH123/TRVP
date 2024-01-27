export default class Flight {
    #tickets = [];
    #flightID;
    #fullName

        constructor({
            flightID,
            fullName
        }) {
        this.#flightID = flightID;
        this.#fullName = fullName;
    }

    get flightID() { return this.#flightID; }

    get tickets() { return this.#tickets; }

    set fullName(value) { this.#fullName = value; }

    appendNewTicket(ticketObject) {
        this.#tickets.push(ticketObject);
    }

    popTicket(ticketID) {
        this.#tickets = this.#tickets.filter((ticket) => ticket.ticketID !== ticketID);
    }

    render() {
        const outerDivElement = document.createElement('div');
        outerDivElement.classList.add('flights-list__item-1');

        const liElement = document.createElement('li');
        liElement.classList.add('flights-list__item', 'flight', 'col-auto');

        const divElement1 = document.createElement('div');
        divElement1.classList.add('flights-list__item-info', 'row');

        const divElement2 = document.createElement('div');
        divElement2.classList.add('flights-list__item-info__header', 'row');

        const spanID = document.createElement('span');
        spanID.classList.add('flight__id', 'col-8', 'align-self-end');
        spanID.innerHTML = this.#fullName;
        divElement2.appendChild(spanID);

        const buttonEdit = document.createElement('button');
        buttonEdit.classList.add('flight__edit-btn', 'btn', 'btn-outline-primary', 'col-2', 'align-self-center');
        buttonEdit.setAttribute('type', 'button');
        buttonEdit.innerHTML = '&#10000;';
        buttonEdit.addEventListener('click', () => {
            document.getElementById('modal-edit-flight').querySelector('.modal-ok-btn')
                .setAttribute('flight_id', this.#flightID);
            document.getElementById('modal-edit-flight').showModal();
        });
        divElement2.appendChild(buttonEdit);

        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('flight__delete-btn', 'btn', 'btn-outline-danger', 'col-2', 'align-self-center');
        buttonDelete.setAttribute('type', 'button');
        buttonDelete.innerHTML = '&#10008;';
        buttonDelete.addEventListener('click', () => {
            document.getElementById('modal-delete-flight').querySelector('.modal-ok-btn')
                .setAttribute('flight_id', this.#flightID);
            document.getElementById('modal-delete-flight').showModal();
        });
        divElement2.appendChild(buttonDelete);

        divElement1.appendChild(divElement2);

        outerDivElement.appendChild(divElement1);

        const ulElement = document.createElement('ul');
        ulElement.classList.add('flight__tickets-list');

        let ticketElement;
        for(let ticket of this.#tickets) {
            ticketElement = ticket.render();
            ulElement.appendChild(ticketElement);
        }

        outerDivElement.appendChild(ulElement);

        const divElement4 = document.createElement('div');
        divElement4.classList.add('row', 'justify-content-center');

        const buttonAddTicket = document.createElement('button');
        buttonAddTicket.classList.add('flight__add-ticket-btn', 'btn', 'btn-outline-primary', 'col-auto');
        buttonAddTicket.setAttribute('type', 'button');
        buttonAddTicket.innerHTML = '&#10010; Выдать книгу';
        buttonAddTicket.addEventListener('click', () => {
            document.getElementById('modal-add-ticket').querySelector('.modal-ok-btn')
                .setAttribute('flight_id', this.#flightID);
            document.getElementById('modal-add-ticket').showModal();
        });
        divElement4.appendChild(buttonAddTicket);

        outerDivElement.appendChild(divElement4);

        liElement.appendChild(outerDivElement);

        return liElement;
    }
};
