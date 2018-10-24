import axios from 'axios';
import {
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISuperoTask, defaultValue } from 'app/shared/model/supero-task.model';

export const ACTION_TYPES = {
  FETCH_SUPEROTASK_LIST: 'superoTask/FETCH_SUPEROTASK_LIST',
  FETCH_SUPEROTASK: 'superoTask/FETCH_SUPEROTASK',
  CREATE_SUPEROTASK: 'superoTask/CREATE_SUPEROTASK',
  UPDATE_SUPEROTASK: 'superoTask/UPDATE_SUPEROTASK',
  DELETE_SUPEROTASK: 'superoTask/DELETE_SUPEROTASK',
  RESET: 'superoTask/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISuperoTask>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type SuperoTaskState = Readonly<typeof initialState>;

// Reducer

export default (state: SuperoTaskState = initialState, action): SuperoTaskState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SUPEROTASK_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SUPEROTASK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SUPEROTASK):
    case REQUEST(ACTION_TYPES.UPDATE_SUPEROTASK):
    case REQUEST(ACTION_TYPES.DELETE_SUPEROTASK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_SUPEROTASK_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SUPEROTASK):
    case FAILURE(ACTION_TYPES.CREATE_SUPEROTASK):
    case FAILURE(ACTION_TYPES.UPDATE_SUPEROTASK):
    case FAILURE(ACTION_TYPES.DELETE_SUPEROTASK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_SUPEROTASK_LIST):
      const links = parseHeaderForLinks(action.payload.headers.link);
      return {
        ...state,
        links,
        loading: false,
        totalItems: action.payload.headers['x-total-count'],
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links)
      };
    case SUCCESS(ACTION_TYPES.FETCH_SUPEROTASK):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SUPEROTASK):
    case SUCCESS(ACTION_TYPES.UPDATE_SUPEROTASK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SUPEROTASK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/supero-tasks';

// Actions

export const getEntities: ICrudGetAllAction<ISuperoTask> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_SUPEROTASK_LIST,
    payload: axios.get<ISuperoTask>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ISuperoTask> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SUPEROTASK,
    payload: axios.get<ISuperoTask>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ISuperoTask> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SUPEROTASK,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const updateEntity: ICrudPutAction<ISuperoTask> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SUPEROTASK,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISuperoTask> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SUPEROTASK,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
