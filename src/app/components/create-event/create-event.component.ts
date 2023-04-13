/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private dialogRef: MatDialogRef<CreateEventComponent>
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dateEvent: ['', Validators.required],
      id: [''],
    });
  }

  onSubmit() {
    const novoEvento = {
      id: Date.now(),
      title: this.eventForm.get('title')?.value,
      description: this.eventForm.get('description')?.value,
      date: this.eventForm.get('dateEvent')?.value,
    };
    this.eventService.adicionarEvento(novoEvento);
    this.eventForm.reset();
    this.dialogRef.close();
  }
}
