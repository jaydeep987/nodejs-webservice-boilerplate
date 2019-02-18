import { EventController } from '~controller/event';
import { RouterBase } from '~lib/router-base';

/**
 * Event related routes
 */
class EventRoutes extends RouterBase {

  /** Instance of controller to register with route */
  private eventController: EventController;

  constructor() {
    super();
  }

  /**
   * Initialze controller
   */
  protected init(): void {
    this.eventController = new EventController();
  }

  /**
   * Register routes for event
   */
  protected registerRoutes(): void {
    const eventRoutes = this.router;
    const eventController = this.eventController;

    eventRoutes.get('/', eventController.getAll);
    eventRoutes.put('/addnewevent', eventController.create);
    eventRoutes.get('/:eventId', eventController.getById);
    eventRoutes.delete('/deleteevent/:eventId', eventController.deleteById);
  }
}

export { EventRoutes };
