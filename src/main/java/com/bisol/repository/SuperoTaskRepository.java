package com.bisol.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bisol.domain.SuperoTask;


/**
 * Spring Data  repository for the SuperoTask entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SuperoTaskRepository extends JpaRepository<SuperoTask, Long> {

	/**
	 * Find all tasks that were not deleted
	 * @param pageable
	 * @return a page of entities
	 */
	Page<SuperoTask> findByDeletedIsFalse(Pageable pageable);

	/**
	 * Find a task with the given id that was not deleted 
	 * @param id
	 * @return the entity with the given id or Optional#empty() if none found
	 */
	Optional<SuperoTask> findByIdAndDeletedIsFalse(Long id);

	/**
	 * Find all tasks that were not deleted
	 * @return a List of entities
	 */
	List<SuperoTask> findByDeletedIsFalse();
}
