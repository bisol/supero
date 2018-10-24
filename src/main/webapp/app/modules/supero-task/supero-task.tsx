import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Button, Col, Row } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities, reset, updateEntity } from './supero-task.reducer';
import { ISuperoTask } from 'app/shared/model/supero-task.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export interface ISuperoTaskProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

// export type ISuperoTaskState = IPaginationBaseState;
export interface ISuperoTaskState extends IPaginationBaseState {
  pendingTasks: ISuperoTask[];
  completedTasks: ISuperoTask[];
}

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 10,
  margin: `0 0 5px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: 5
});

export class SuperoTask extends React.Component<ISuperoTaskProps, ISuperoTaskState> {
  state: ISuperoTaskState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE),
    pendingTasks: [],
    completedTasks: []
  };

  componentDidMount() {
    this.reset();
  }

  componentDidUpdate() {
    if (this.props.updateSuccess) {
      this.reset();
    }
  }

  reset = () => {
    this.props.reset();
    this.setState({ activePage: 1 }, () => {
      this.getEntities();
    });
  };

  handleLoadMore = () => {
    if (window.pageYOffset > 0) {
      this.setState({ activePage: this.state.activePage + 1 }, () => this.getEntities());
    }
  };

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => {
        this.reset();
      }
    );
  };

  getPendingTasks = () => this.props.superoTaskList.filter(task => task.status === 'PENDING');

  getCompletedTasks = () => this.props.superoTaskList.filter(task => task.status === 'COMPLETE');

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  onDragEnd = result => {
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) return;

    let task;
    if (source.droppableId === 'pendingDroppable') {
      task = this.state.pendingTasks[source.index];
      task.status = 'COMPLETE';
    } else {
      task = this.state.completedTasks[source.index];
      task.status = 'PENDING';
    }

    this.props.updateEntity(task);
  };

  render() {
    const { superoTaskList, match } = this.props;
    this.state.completedTasks = this.getCompletedTasks();
    this.state.pendingTasks = this.getPendingTasks();
    return (
      <div>
        <h2 id="supero-task-heading">
          <Translate contentKey="superoApp.superoTask.home.title">Supero Tasks</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="superoApp.superoTask.home.createLabel">Create new Supero Task</Translate>
          </Link>
        </h2>
        <div>
          <InfiniteScroll
            pageStart={this.state.activePage}
            loadMore={this.handleLoadMore}
            hasMore={this.state.activePage - 1 < this.props.links.next}
            loader={<div className="loader">Loading ...</div>}
            threshold={0}
            initialLoad={false}
          >
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Row>
                <Droppable droppableId="pendingDroppable">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} className="col-6">
                      <h3 id="supero-task-heading">
                        <Translate contentKey="superoApp.superoTask.pending">Pending</Translate>
                      </h3>
                      {this.state.pendingTasks.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(draggableProvided, draggableSnapshot) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
                            >
                              <Card>
                                <CardBody>
                                  <CardTitle>
                                    {item.id} - {item.title}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <TextFormat type="date" value={item.creationDate} format={APP_DATE_FORMAT} />
                                  </CardSubtitle>
                                  <CardText>{item.description}</CardText>
                                  <div className="btn-group">
                                    <Button tag={Link} to={`${match.url}/${item.id}`} color="info" size="sm">
                                      <FontAwesomeIcon icon="eye" />{' '}
                                      <span className="d-none d-md-inline">
                                        <Translate contentKey="entity.action.view">View</Translate>
                                      </span>
                                    </Button>
                                    <Button tag={Link} to={`${match.url}/${item.id}/edit`} color="primary" size="sm">
                                      <FontAwesomeIcon icon="pencil-alt" />{' '}
                                      <span className="d-none d-md-inline">
                                        <Translate contentKey="entity.action.edit">Edit</Translate>
                                      </span>
                                    </Button>
                                    <Button tag={Link} to={`${match.url}/${item.id}/delete`} color="danger" size="sm">
                                      <FontAwesomeIcon icon="trash" />{' '}
                                      <span className="d-none d-md-inline">
                                        <Translate contentKey="entity.action.delete">Delete</Translate>
                                      </span>
                                    </Button>
                                  </div>
                                </CardBody>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="completeDroppable">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} className="col-6">
                      <h3 id="supero-task-heading">
                        <Translate contentKey="superoApp.superoTask.completed">Pending</Translate>
                      </h3>
                      {this.state.completedTasks.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(draggableProvided, draggableSnapshot) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
                            >
                              <Card>
                                <CardBody>
                                  <CardTitle>
                                    {item.id} - {item.title}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <TextFormat type="date" value={item.creationDate} format={APP_DATE_FORMAT} />
                                  </CardSubtitle>
                                  <CardText>{item.description}</CardText>
                                  <div className="btn-group">
                                    <Button tag={Link} to={`${match.url}/${item.id}`} color="info" size="sm">
                                      <FontAwesomeIcon icon="eye" />{' '}
                                      <span className="d-none d-md-inline">
                                        <Translate contentKey="entity.action.view">View</Translate>
                                      </span>
                                    </Button>
                                    <Button tag={Link} to={`${match.url}/${item.id}/edit`} color="primary" size="sm">
                                      <FontAwesomeIcon icon="pencil-alt" />{' '}
                                      <span className="d-none d-md-inline">
                                        <Translate contentKey="entity.action.edit">Edit</Translate>
                                      </span>
                                    </Button>
                                    <Button tag={Link} to={`${match.url}/${item.id}/delete`} color="danger" size="sm">
                                      <FontAwesomeIcon icon="trash" />{' '}
                                      <span className="d-none d-md-inline">
                                        <Translate contentKey="entity.action.delete">Delete</Translate>
                                      </span>
                                    </Button>
                                  </div>
                                </CardBody>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Row>
            </DragDropContext>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ superoTask }: IRootState) => ({
  superoTaskList: superoTask.entities,
  totalItems: superoTask.totalItems,
  links: superoTask.links,
  entity: superoTask.entity,
  updateSuccess: superoTask.updateSuccess
});

const mapDispatchToProps = {
  getEntities,
  updateEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuperoTask);
