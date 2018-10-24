package com.bisol.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.bisol.domain.SuperoTask;
import com.bisol.domain.enumeration.TaskStatus;
import com.bisol.repository.SuperoTaskRepository;
import com.bisol.web.rest.errors.BadRequestAlertException;
import com.bisol.web.rest.util.HeaderUtil;
import com.bisol.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing SuperoTask.
 */
@RestController
@RequestMapping("/api")
public class SuperoTaskResource {

    private final Logger log = LoggerFactory.getLogger(SuperoTaskResource.class);

    private static final String ENTITY_NAME = "superoTask";

    private SuperoTaskRepository superoTaskRepository;

    public SuperoTaskResource(SuperoTaskRepository superoTaskRepository) {
        this.superoTaskRepository = superoTaskRepository;
    }

    /**
     * POST  /supero-tasks : Create a new superoTask.
     *
     * @param superoTask the superoTask to create
     * @return the ResponseEntity with status 201 (Created) and with body the new superoTask, or with status 400 (Bad Request) if the superoTask has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/supero-tasks")
    @Timed
    public ResponseEntity<SuperoTask> createSuperoTask(@Valid @RequestBody SuperoTask superoTask) throws URISyntaxException {
        log.debug("REST request to save SuperoTask : {}", superoTask);
        if (superoTask.getId() != null) {
            throw new BadRequestAlertException("A new superoTask cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        if (superoTask.getStatus().equals(TaskStatus.COMPLETE)) {
        	superoTask.setCompletionDate(Instant.now());
        }
        SuperoTask result = superoTaskRepository.save(superoTask);
        return ResponseEntity.created(new URI("/api/supero-tasks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /supero-tasks : Updates an existing superoTask.
     *
     * @param superoTask the superoTask to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated superoTask,
     * or with status 400 (Bad Request) if the superoTask is not valid,
     * or with status 500 (Internal Server Error) if the superoTask couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/supero-tasks")
    @Timed
    public ResponseEntity<SuperoTask> updateSuperoTask(@Valid @RequestBody SuperoTask superoTask) throws URISyntaxException {
        log.debug("REST request to update SuperoTask : {}", superoTask);
        if (superoTask.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        superoTask.setUpdateDate(Instant.now());
        if (superoTask.getStatus().equals(TaskStatus.PENDING)) {
        	superoTask.setCompletionDate(null);
        } else {
        	superoTask.setCompletionDate(Instant.now());
        }
        
        SuperoTask result = superoTaskRepository.save(superoTask);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, superoTask.getId().toString()))
            .body(result);
    }

    /**
     * GET  /supero-tasks : get all the superoTasks.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of superoTasks in body
     */
    @GetMapping("/supero-tasks")
    @Timed
    public ResponseEntity<List<SuperoTask>> getAllSuperoTasks(Pageable pageable) {
        log.debug("REST request to get a page of SuperoTasks");
        Page<SuperoTask> page = superoTaskRepository.findByDeletedIsFalse(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/supero-tasks");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /supero-tasks/:id : get the "id" superoTask.
     *
     * @param id the id of the superoTask to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the superoTask, or with status 404 (Not Found)
     */
    @GetMapping("/supero-tasks/{id}")
    @Timed
    public ResponseEntity<SuperoTask> getSuperoTask(@PathVariable Long id) {
        log.debug("REST request to get SuperoTask : {}", id);
        Optional<SuperoTask> superoTask = superoTaskRepository.findByIdAndDeletedIsFalse(id);
        return ResponseUtil.wrapOrNotFound(superoTask);
    }

    /**
     * DELETE  /supero-tasks/:id : marks superoTask with the given id as deleted.
     *
     * @param id the id of the superoTask to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/supero-tasks/{id}")
    @Timed
    public ResponseEntity<Void> deleteSuperoTask(@PathVariable Long id) {
        log.debug("REST request to delete SuperoTask : {}", id);
        
        Optional<SuperoTask> superoTaskOptional = superoTaskRepository.findById(id);
        if (!superoTaskOptional.isPresent()) {
            String errorMessage = "Task " + id + " not found";
			return ResponseEntity.notFound().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, errorMessage, errorMessage)).build();
        }
        
        SuperoTask superoTask = superoTaskOptional.get();
        superoTask.setDeleted(true);
        superoTask.setDeletionDate(Instant.now());
        superoTaskRepository.save(superoTask);

        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
