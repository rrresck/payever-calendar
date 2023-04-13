/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { Event } from '../models/event';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventosKey = 'eventos';
  eventosChanged = new EventEmitter<Event[]>();
  eventosExcluido = new EventEmitter<number>();

  constructor() {}

  getEventsFromStorage(): Event[] {
    const eventosString = localStorage.getItem(this.eventosKey);

    return eventosString
      ? JSON.parse(eventosString, (key, value) => {
          if (key === 'date') {
            return new Date(value);
          } else {
            return value;
          }
        })
      : [];
  }
  getEvents(): Event[] {
    return this.getEventsFromStorage();
  }

  getEventsData(data: Date): any[] {
    const eventos = this.getEventsFromStorage();
    return eventos.filter((evento) => {
      const eventoData = new Date(evento.date);
      return eventoData.toDateString() === data.toDateString();
    });
  }

  refreshEvents() {
    const eventos = this.getEventsFromStorage();
    this.eventosChanged.next(eventos.slice());
  }

  adicionarEvento(evento: Event) {
    const eventos = this.getEventsFromStorage();
    const newId = eventos.length > 0 ? eventos[eventos.length - 1].id + 1 : 1;
    const novoEvento = { ...evento, id: newId };
    eventos.push(novoEvento);
    localStorage.setItem(this.eventosKey, JSON.stringify(eventos));
    this.eventosChanged.next(eventos.slice());
  }

  removeEvent(event: Event) {
    const eventos = this.getEventsFromStorage();
    const index = eventos.findIndex((e) => e.id === event.id);
    if (index === -1) return;
    eventos.splice(index, 1);
    localStorage.setItem(this.eventosKey, JSON.stringify(eventos));
    this.eventosExcluido.emit(event.id);
    this.refreshEvents();
  }

  moveEvent(event: Event, previousDate: string, newDate: string) {
    const eventos = this.getEventsFromStorage();
    const index = eventos.findIndex((e) => e.id === event.id);
    if (index === -1) return;

    const newDateObj = new Date(newDate);
    eventos[index].date = new Date(
      newDateObj.getFullYear(),
      newDateObj.getMonth(),
      newDateObj.getDate(),
      event.date.getHours(),
      event.date.getMinutes()
    );

    localStorage.setItem(this.eventosKey, JSON.stringify(eventos));
    this.eventosChanged.next(eventos.slice());
  }
}
