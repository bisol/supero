package com.bisol.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

import com.bisol.domain.enumeration.TaskStatus;

/**
 * A SuperoTask.
 */
@Entity
@Table(name = "t_supero_task")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class SuperoTask implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 5)
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status;

    @NotNull
    @Column(name = "creation_date", nullable = false)
    private Instant creationDate = Instant.now();

    @Column(name = "update_date")
    private Instant updateDate;

    @Column(name = "completion_date")
    private Instant completionDate;

    @Column(name = "deletion_date")
    private Instant deletionDate;

    @NotNull
    @Column(name = "deleted", nullable = false)
    private Boolean deleted;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public SuperoTask title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public SuperoTask description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public SuperoTask status(TaskStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public SuperoTask creationDate(Instant creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Instant getUpdateDate() {
        return updateDate;
    }

    public SuperoTask updateDate(Instant updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(Instant updateDate) {
        this.updateDate = updateDate;
    }

    public Instant getCompletionDate() {
        return completionDate;
    }

    public SuperoTask completionDate(Instant completionDate) {
        this.completionDate = completionDate;
        return this;
    }

    public void setCompletionDate(Instant completionDate) {
        this.completionDate = completionDate;
    }

    public Instant getDeletionDate() {
        return deletionDate;
    }

    public SuperoTask deletionDate(Instant deletionDate) {
        this.deletionDate = deletionDate;
        return this;
    }

    public void setDeletionDate(Instant deletionDate) {
        this.deletionDate = deletionDate;
    }

    public Boolean isDeleted() {
        return deleted;
    }

    public SuperoTask deleted(Boolean deleted) {
        this.deleted = deleted;
        return this;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SuperoTask superoTask = (SuperoTask) o;
        if (superoTask.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), superoTask.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SuperoTask{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", status='" + getStatus() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            ", updateDate='" + getUpdateDate() + "'" +
            ", completionDate='" + getCompletionDate() + "'" +
            ", deletionDate='" + getDeletionDate() + "'" +
            ", deleted='" + isDeleted() + "'" +
            "}";
    }
}
