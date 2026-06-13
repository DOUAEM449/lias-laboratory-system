package com.lias.lias_backend.repository;

import com.lias.lias_backend.entity.Member;
import com.lias.lias_backend.entity.Publication;
import com.lias.lias_backend.entity.PublicationAuthor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PublicationAuthorRepository extends JpaRepository<PublicationAuthor, UUID> {

    List<PublicationAuthor> findByPublication(Publication publication);

    List<PublicationAuthor> findByMember(Member member);

    List<PublicationAuthor> findByPublicationOrderByAuthorOrder(Publication publication);

    List<PublicationAuthor> findByMemberOrderByAuthorOrder(Member member);

    @Query("SELECT pa FROM PublicationAuthor pa WHERE pa.publication.id = :publicationId ORDER BY pa.authorOrder")
    List<PublicationAuthor> findPublicationAuthorsOrdered(@Param("publicationId") UUID publicationId);

    @Query("SELECT pa FROM PublicationAuthor pa WHERE pa.member.id = :memberId ORDER BY pa.publication.pubYear DESC")
    List<PublicationAuthor> findMemberPublicationsByYear(@Param("memberId") UUID memberId);

    @Query("SELECT COUNT(pa) FROM PublicationAuthor pa WHERE pa.member.id = :memberId")
    Long countPublicationsByMember(@Param("memberId") UUID memberId);

    @Query("SELECT pa FROM PublicationAuthor pa WHERE pa.member IS NULL")
    List<PublicationAuthor> findExternalAuthors();
}
