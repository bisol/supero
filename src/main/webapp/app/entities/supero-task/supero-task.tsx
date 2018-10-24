import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities, reset } from './supero-task.reducer';
import { ISuperoTask } from 'app/shared/model/supero-task.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ISuperoTaskProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export type ISuperoTaskState = IPaginationBaseState;

export class SuperoTask extends React.Component<ISuperoTaskProps, ISuperoTaskState> {
  state: ISuperoTaskState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE)
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

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  render() {
    const { superoTaskList, match } = this.props;
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
        <div className="table-responsive">
          <InfiniteScroll
            pageStart={this.state.activePage}
            loadMore={this.handleLoadMore}
            hasMore={this.state.activePage - 1 < this.props.links.next}
            loader={<div className="loader">Loading ...</div>}
            threshold={0}
            initialLoad={false}
          >
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={this.sort('id')}>
                    <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('title')}>
                    <Translate contentKey="superoApp.superoTask.title">Title</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('description')}>
                    <Translate contentKey="superoApp.superoTask.description">Description</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('status')}>
                    <Translate contentKey="superoApp.superoTask.status">Status</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('creationDate')}>
                    <Translate contentKey="superoApp.superoTask.creationDate">Creation Date</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('updateDate')}>
                    <Translate contentKey="superoApp.superoTask.updateDate">Update Date</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('completionDate')}>
                    <Translate contentKey="superoApp.superoTask.completionDate">Completion Date</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('deletionDate')}>
                    <Translate contentKey="superoApp.superoTask.deletionDate">Deletion Date</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('deleted')}>
                    <Translate contentKey="superoApp.superoTask.deletedStatus">Deleted</Translate> <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {superoTaskList.map((superoTask, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${superoTask.id}`} color="link" size="sm">
                        {superoTask.id}
                      </Button>
                    </td>
                    <td>{superoTask.title}</td>
                    <td>{superoTask.description}</td>
                    <td>
                      <Translate contentKey={`superoApp.TaskStatus.${superoTask.status}`} />
                    </td>
                    <td>
                      <TextFormat type="date" value={superoTask.creationDate} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      <TextFormat type="date" value={superoTask.updateDate} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      <TextFormat type="date" value={superoTask.completionDate} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      <TextFormat type="date" value={superoTask.deletionDate} format={APP_DATE_FORMAT} />
                    </td>
                    <td>{superoTask.deleted ? 'true' : 'false'}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${superoTask.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${superoTask.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${superoTask.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuperoTask);