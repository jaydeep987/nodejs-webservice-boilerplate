import * as Joi from 'joi';
import { Schema, model } from 'mongoose';

const EventSchema = new Schema({
  eventTitle: {
    type: String,
    required: 'Enter event title',
  },
  subtitle: {
    type: String,
  },
  eventType: {
    type: String,
    required: 'Enter type of event',
  },
  description: {
    type: String,
    required: 'Enter event description',
  },
  comments: {
    type: String,
  },
  startDate: {
    type: String,
    required: 'Enter event start date',
  },
  endDate: {
    type: String,
    required: 'Enter event end date',
  },
  status: {
    type: String,
    required: 'Enter event status',
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
  created_by: {
    type: String,
  },
  updated_date: {
    type: Date,
  },
  updated_by: {
    type: String,
  },
});

const eventValidationSchema = Joi
  .object()
  .keys({
    eventTitle: Joi
      .string()
      .required(),
    subtitle: Joi
      .string()
      .optional(),
    eventType: Joi
      .string()
      .required(),
    description: Joi
      .string()
      .required(),
    comments: Joi
      .string()
      .optional(),
    startDate: Joi
      .string()
      .required(),
    endDate: Joi
      .string()
      .required(),
    status: Joi
      .string()
      .required(),
    created_date: Joi
      .string()
      .optional(),
    created_by: Joi
      .string()
      .optional(),
    updated_date: Joi
      .string()
      .optional(),
    updated_by: Joi
      .string()
      .optional(),
  });

const EventModel = model('Event', EventSchema);

export { EventModel, eventValidationSchema };
