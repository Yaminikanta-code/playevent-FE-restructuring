import { createApiHooks } from './base.api'
import { eventService } from '../services/event.service'

// Create base CRUD hooks using the factory
const eventHooks = createApiHooks(eventService, {
  serviceName: 'events',
  queryKeys: {
    list: ['events'],
    detail: (id: string) => ['events', id],
  },
  alerts: {
    createSuccess: 'Event created successfully!',
    updateSuccess: 'Event updated successfully!',
    deleteSuccess: 'Event archived successfully!',
  },
})

// Export base CRUD hooks
export const {
  useList: useEventList,
  useGetById: useEventById,
  useCreate: useCreateEvent,
  useUpdate: useUpdateEvent,
  useDelete: useDeleteEvent,
} = eventHooks

// Re-export types for convenience
export type { EventCreate, EventUpdate, EventRead } from '../types/event.types'
