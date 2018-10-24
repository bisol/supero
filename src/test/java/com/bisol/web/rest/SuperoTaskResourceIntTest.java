package com.bisol.web.rest;

import com.bisol.SuperoApp;

import com.bisol.domain.SuperoTask;
import com.bisol.repository.SuperoTaskRepository;
import com.bisol.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static com.bisol.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bisol.domain.enumeration.TaskStatus;
/**
 * Test class for the SuperoTaskResource REST controller.
 *
 * @see SuperoTaskResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SuperoApp.class)
public class SuperoTaskResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final TaskStatus DEFAULT_STATUS = TaskStatus.PENDING;
    private static final TaskStatus UPDATED_STATUS = TaskStatus.COMPLETE;

    private static final Instant DEFAULT_CREATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_COMPLETION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_COMPLETION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DELETION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DELETION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_DELETED = false;
    private static final Boolean UPDATED_DELETED = true;

    @Autowired
    private SuperoTaskRepository superoTaskRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSuperoTaskMockMvc;

    private SuperoTask superoTask;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SuperoTaskResource superoTaskResource = new SuperoTaskResource(superoTaskRepository);
        this.restSuperoTaskMockMvc = MockMvcBuilders.standaloneSetup(superoTaskResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SuperoTask createEntity(EntityManager em) {
        SuperoTask superoTask = new SuperoTask()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .status(DEFAULT_STATUS)
            .creationDate(DEFAULT_CREATION_DATE)
            .updateDate(DEFAULT_UPDATE_DATE)
            .completionDate(DEFAULT_COMPLETION_DATE)
            .deletionDate(DEFAULT_DELETION_DATE)
            .deleted(DEFAULT_DELETED);
        return superoTask;
    }

    @Before
    public void initTest() {
        superoTask = createEntity(em);
    }

    @Test
    @Transactional
    public void createSuperoTask() throws Exception {
        int databaseSizeBeforeCreate = superoTaskRepository.findAll().size();

        // Create the SuperoTask
        restSuperoTaskMockMvc.perform(post("/api/supero-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(superoTask)))
            .andExpect(status().isCreated());

        // Validate the SuperoTask in the database
        List<SuperoTask> superoTaskList = superoTaskRepository.findAll();
        assertThat(superoTaskList).hasSize(databaseSizeBeforeCreate + 1);
        SuperoTask testSuperoTask = superoTaskList.get(superoTaskList.size() - 1);
        assertThat(testSuperoTask.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testSuperoTask.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSuperoTask.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSuperoTask.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testSuperoTask.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testSuperoTask.getCompletionDate()).isEqualTo(DEFAULT_COMPLETION_DATE);
        assertThat(testSuperoTask.getDeletionDate()).isEqualTo(DEFAULT_DELETION_DATE);
        assertThat(testSuperoTask.isDeleted()).isEqualTo(DEFAULT_DELETED);
    }

    @Test
    @Transactional
    public void createSuperoTaskWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = superoTaskRepository.findAll().size();

        // Create the SuperoTask with an existing ID
        superoTask.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSuperoTaskMockMvc.perform(post("/api/supero-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(superoTask)))
            .andExpect(status().isBadRequest());

        // Validate the SuperoTask in the database
        List<SuperoTask> superoTaskList = superoTaskRepository.findAll();
        assertThat(superoTaskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = superoTaskRepository.findAll().size();
        // set the field null
        superoTask.setTitle(null);

        // Create the SuperoTask, which fails.

        restSuperoTaskMockMvc.perform(post("/api/supero-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(superoTask)))
            .andExpect(status().isBadRequest());

        List<SuperoTask> superoTaskList = superoTaskRepository.findAll();
        assertThat(superoTaskList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = superoTaskRepository.findAll().size();
        // set the field null
        superoTask.setStatus(null);

        // Create the SuperoTask, which fails.

        restSuperoTaskMockMvc.perform(post("/api/supero-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(superoTask)))
            .andExpect(status().isBadRequest());

        List<SuperoTask> superoTaskList = superoTaskRepository.findAll();
        assertThat(superoTaskList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDeletedIsRequired() throws Exception {
        int databaseSizeBeforeTest = superoTaskRepository.findAll().size();
        // set the field null
        superoTask.setDeleted(null);

        // Create the SuperoTask, which fails.

        restSuperoTaskMockMvc.perform(post("/api/supero-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(superoTask)))
            .andExpect(status().isBadRequest());

        List<SuperoTask> superoTaskList = superoTaskRepository.findAll();
        assertThat(superoTaskList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSuperoTasks() throws Exception {
        // Initialize the database
        superoTaskRepository.saveAndFlush(superoTask);

        // Get all the superoTaskList
        restSuperoTaskMockMvc.perform(get("/api/supero-tasks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(superoTask.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(DEFAULT_UPDATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].completionDate").value(hasItem(DEFAULT_COMPLETION_DATE.toString())))
            .andExpect(jsonPath("$.[*].deletionDate").value(hasItem(DEFAULT_DELETION_DATE.toString())))
            .andExpect(jsonPath("$.[*].deleted").value(hasItem(DEFAULT_DELETED.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getSuperoTask() throws Exception {
        // Initialize the database
        superoTaskRepository.saveAndFlush(superoTask);

        // Get the superoTask
        restSuperoTaskMockMvc.perform(get("/api/supero-tasks/{id}", superoTask.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(superoTask.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()))
            .andExpect(jsonPath("$.updateDate").value(DEFAULT_UPDATE_DATE.toString()))
            .andExpect(jsonPath("$.completionDate").value(DEFAULT_COMPLETION_DATE.toString()))
            .andExpect(jsonPath("$.deletionDate").value(DEFAULT_DELETION_DATE.toString()))
            .andExpect(jsonPath("$.deleted").value(DEFAULT_DELETED.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSuperoTask() throws Exception {
        // Get the superoTask
        restSuperoTaskMockMvc.perform(get("/api/supero-tasks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSuperoTask() throws Exception {
        // Initialize the database
        superoTaskRepository.saveAndFlush(superoTask);

        int databaseSizeBeforeUpdate = superoTaskRepository.findAll().size();

        // Update the superoTask
        SuperoTask updatedSuperoTask = superoTaskRepository.findById(superoTask.getId()).get();
        // Disconnect from session so that the updates on updatedSuperoTask are not directly saved in db
        em.detach(updatedSuperoTask);
        updatedSuperoTask
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .status(UPDATED_STATUS)
//            .creationDate(UPDATED_CREATION_DATE)
//            .updateDate(UPDATED_UPDATE_DATE)
//            .completionDate(UPDATED_COMPLETION_DATE)
//            .deletionDate(UPDATED_DELETION_DATE)
            .deleted(UPDATED_DELETED);

        restSuperoTaskMockMvc.perform(put("/api/supero-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSuperoTask)))
            .andExpect(status().isOk());

        // Validate the SuperoTask in the database
        List<SuperoTask> superoTaskList = superoTaskRepository.findAll();
        assertThat(superoTaskList).hasSize(databaseSizeBeforeUpdate);
        SuperoTask testSuperoTask = superoTaskList.get(superoTaskList.size() - 1);
        assertThat(testSuperoTask.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testSuperoTask.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSuperoTask.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSuperoTask.getCreationDate()).isNotNull();
        assertThat(testSuperoTask.getUpdateDate()).isNotNull();
        assertThat(testSuperoTask.getCompletionDate()).isNotNull();
        assertThat(testSuperoTask.getDeletionDate()).isNotNull();
        assertThat(testSuperoTask.isDeleted()).isEqualTo(UPDATED_DELETED);
    }

    @Test
    @Transactional
    public void updateNonExistingSuperoTask() throws Exception {
        int databaseSizeBeforeUpdate = superoTaskRepository.findAll().size();

        // Create the SuperoTask

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSuperoTaskMockMvc.perform(put("/api/supero-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(superoTask)))
            .andExpect(status().isBadRequest());

        // Validate the SuperoTask in the database
        List<SuperoTask> superoTaskList = superoTaskRepository.findAll();
        assertThat(superoTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSuperoTask() throws Exception {
        // Initialize the database
        superoTaskRepository.saveAndFlush(superoTask);

        int databaseSizeBeforeDelete = superoTaskRepository.findByDeletedIsFalse().size();

        // Get the superoTask
        restSuperoTaskMockMvc.perform(delete("/api/supero-tasks/{id}", superoTask.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SuperoTask> superoTaskList = superoTaskRepository.findByDeletedIsFalse();
        assertThat(superoTaskList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SuperoTask.class);
        SuperoTask superoTask1 = new SuperoTask();
        superoTask1.setId(1L);
        SuperoTask superoTask2 = new SuperoTask();
        superoTask2.setId(superoTask1.getId());
        assertThat(superoTask1).isEqualTo(superoTask2);
        superoTask2.setId(2L);
        assertThat(superoTask1).isNotEqualTo(superoTask2);
        superoTask1.setId(null);
        assertThat(superoTask1).isNotEqualTo(superoTask2);
    }
}
