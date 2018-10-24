import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './supero-task.reducer';
import { ISuperoTask } from 'app/shared/model/supero-task.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ISuperoTaskUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ISuperoTaskUpdateState {
  isNew: boolean;
}

export class SuperoTaskUpdate extends React.Component<ISuperoTaskUpdateProps, ISuperoTaskUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (!this.state.isNew) {
      this.props.getEntity(this.props.match.params.id);
    }
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { superoTaskEntity } = this.props;
      const entity = {
        ...superoTaskEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/');
  };

  render() {
    const { superoTaskEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="superoApp.superoTask.home.createOrEditLabel">
              <Translate contentKey="superoApp.superoTask.home.createOrEditLabel">Create or edit a SuperoTask</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : superoTaskEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="supero-task-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="title">
                    <Translate contentKey="superoApp.superoTask.title">Title</Translate>
                  </Label>
                  <AvField
                    id="supero-task-title"
                    type="text"
                    name="title"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      minLength: { value: 5, errorMessage: translate('entity.validation.minlength', { min: 5 }) }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="description">
                    <Translate contentKey="superoApp.superoTask.description">Description</Translate>
                  </Label>
                  <AvField id="supero-task-description" type="textarea" name="description" />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel">
                    <Translate contentKey="superoApp.superoTask.status">Status</Translate>
                  </Label>
                  <AvInput
                    id="supero-task-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && superoTaskEntity.status) || 'PENDING'}
                  >
                    <option value="PENDING">
                      <Translate contentKey="superoApp.TaskStatus.PENDING" />
                    </option>
                    <option value="COMPLETE">
                      <Translate contentKey="superoApp.TaskStatus.COMPLETE" />
                    </option>
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  superoTaskEntity: storeState.superoTask.entity,
  loading: storeState.superoTask.loading,
  updating: storeState.superoTask.updating,
  updateSuccess: storeState.superoTask.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuperoTaskUpdate);
