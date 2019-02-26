import { Request, Response } from 'express';
import * as Joi from 'joi';
import { ErrorTypes, ResponseStatus } from '~common/constants';
import { ControllerBase } from '~lib/controller-base';
import { EventModel, eventValidationSchema } from '~model/event';
import { Logger } from '~utils/logger';

/**
 * Controller for handling events
 */
class EventController extends ControllerBase {

  /**
   * Creates new event in database
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { value, error } = Joi.validate(req.body, eventValidationSchema);

      if (error && error.details) {
        Logger.error({
          message: 'Validation error',
          prefix: 'EventController:create',
          extraInfo: error.details,
        });

        return res
          .status(ResponseStatus.BAD_REQUEST)
          .json(this.wrapErrorResponse(error, ErrorTypes.VALIDATION_ERROR));
      }

      const event = await EventModel.create(value);

      return res
        .status(ResponseStatus.OK)
        .json(event);

    } catch (error) {
      Logger.error({
        message: 'Error while saving record',
        prefix: 'EventController:create',
        extraInfo: error,
      });

      return res
        .status(ResponseStatus.INTERNAL_ERROR)
        .json(this.wrapErrorResponse(error, ErrorTypes.INTERNAL_ERROR));
    }
  }

  /**
   * Get all events
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const events =
        await EventModel
          .find()
          .exec();

      if (!events) {
        return res
          .status(ResponseStatus.NOT_FOUND)
          .json(this.wrapErrorResponse('Record not found', ErrorTypes.FETCH_ERROR));
      }

      return res
        .status(ResponseStatus.OK)
        .json(events);

    } catch (error) {
      Logger.error({
        message: 'Error while retrieving',
        prefix: 'EventController:getEvents',
        extraInfo: error,
      });

      return res
        .status(ResponseStatus.INTERNAL_ERROR)
        .json(this.wrapErrorResponse(error, ErrorTypes.INTERNAL_ERROR));
    }
  }

  /**
   * Get event by id
   */
  getById = async (req: Request, res: Response): Promise<Response> => {
    if (!req.params.eventId) {
      return res
        .status(ResponseStatus.BAD_REQUEST)
        .json(this.wrapErrorResponse('Missing eventId parameter', ErrorTypes.PARAM_ERROR));
    }

    try {
      const event =
        await EventModel
          .findById(req.params.eventId)
          .exec();

      if (!event) {
        return res
          .status(ResponseStatus.NOT_FOUND)
          .json(this.wrapErrorResponse('Record not found', ErrorTypes.FETCH_ERROR));
      }

      return res
        .status(ResponseStatus.OK)
        .json(event);

    } catch (error) {
      Logger.error({
        message: 'Error while retrieving',
        prefix: 'EventController:getById',
        extraInfo: error,
      });

      return res
        .status(ResponseStatus.INTERNAL_ERROR)
        .json(this.wrapErrorResponse(error, ErrorTypes.INTERNAL_ERROR));
    }
  }

  /**
   * Delete single event by id
   */
  deleteById = async (req: Request, res: Response): Promise<Response> => {
    if (!req.params.eventId) {
      return res
        .status(ResponseStatus.BAD_REQUEST)
        .json(this.wrapErrorResponse('Missing eventId paramter', ErrorTypes.PARAM_ERROR));
    }

    try {
      const deletedEvent =
        await EventModel
          .deleteOne({_id: req.params.eventId})
          .exec();

      if (!deletedEvent) {
        return res
          .status(ResponseStatus.NOT_FOUND)
          .json(this.wrapErrorResponse('Record not found', ErrorTypes.FETCH_ERROR));
      }

      return res
        .status(ResponseStatus.OK)
        .json(deletedEvent);
    } catch (error) {
      Logger.error({
        message: 'Error while deleting',
        prefix: 'EventController:deleteById',
        extraInfo: error,
      });

      return res
        .status(ResponseStatus.INTERNAL_ERROR)
        .json(this.wrapErrorResponse(error, ErrorTypes.INTERNAL_ERROR));
    }
  }
}

export { EventController };
