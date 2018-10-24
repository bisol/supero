import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './supero-task.reducer';
import { ISuperoTask } from 'app/shared/model/supero-task.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISuperoTaskDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class SuperoTaskDetail extends React.Component<ISuperoTaskDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { superoTaskEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="superoApp.superoTask.detail.title">SuperoTask</Translate> [<b>{superoTaskEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">
                <Translate contentKey="superoApp.superoTask.title">Title</Translate>
              </span>
            </dt>
            <dd>{superoTaskEntity.title}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="superoApp.superoTask.description">Description</Translate>
              </span>
            </dt>
            <dd>{superoTaskEntity.description}</dd>
            <dt>
              <span id="status">
                <Translate contentKey="superoApp.superoTask.status">Status</Translate>
              </span>
            </dt>
            <dd>{superoTaskEntity.status}</dd>
            <dt>
              <span id="creationDate">
                <Translate contentKey="superoApp.superoTask.creationDate">Creation Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={superoTaskEntity.creationDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="updateDate">
                <Translate contentKey="superoApp.superoTask.updateDate">Update Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={superoTaskEntity.updateDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="completionDate">
                <Translate contentKey="superoApp.superoTask.completionDate">Completion Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={superoTaskEntity.completionDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="deletionDate">
                <Translate contentKey="superoApp.superoTask.deletionDate">Deletion Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={superoTaskEntity.deletionDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="deleted">
                <Translate contentKey="superoApp.superoTask.deleted">Deleted</Translate>
              </span>
            </dt>
            <dd>{superoTaskEntity.deleted ? 'true' : 'false'}</dd>
          </dl>
          <Button tag={Link} to="/entity/supero-task" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/supero-task/${superoTaskEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ superoTask }: IRootState) => ({
  superoTaskEntity: superoTask.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuperoTaskDetail);
