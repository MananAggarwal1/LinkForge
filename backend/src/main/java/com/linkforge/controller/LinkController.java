package com.linkforge.controller;

import com.linkforge.dto.link.CreateLinkRequest;
import com.linkforge.dto.link.LinkResponse;
import com.linkforge.dto.link.UpdateLinkRequest;
import com.linkforge.service.LinkService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/links")
public class LinkController {

    private final LinkService linkService;

    public LinkController(LinkService linkService) {
        this.linkService = linkService;
    }

    @PostMapping
    public ResponseEntity<LinkResponse> createLink(@Valid @RequestBody CreateLinkRequest request) {
        LinkResponse response = linkService.createLink(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LinkResponse>> getUserLinks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tag) {
        List<LinkResponse> links = linkService.getUserLinks(search, tag);
        return ResponseEntity.ok(links);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LinkResponse> getLinkById(@PathVariable String id) {
        LinkResponse response = linkService.getLinkById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LinkResponse> updateLink(
            @PathVariable String id,
            @RequestBody UpdateLinkRequest request) {
        LinkResponse response = linkService.updateLink(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLink(@PathVariable String id) {
        linkService.deleteLink(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<LinkResponse> toggleLinkActive(@PathVariable String id) {
        LinkResponse response = linkService.toggleActiveStatus(id);
        return ResponseEntity.ok(response);
    }
}
