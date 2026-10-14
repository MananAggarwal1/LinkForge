package com.linkforge.controller;

import com.linkforge.dto.link.LinkResponse;
import com.linkforge.service.LinkService;
import com.linkforge.service.QrCodeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/links")
public class QrCodeController {

    private final LinkService linkService;
    private final QrCodeService qrCodeService;

    public QrCodeController(LinkService linkService, QrCodeService qrCodeService) {
        this.linkService = linkService;
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getLinkQrCode(
            @PathVariable String id,
            @RequestParam(defaultValue = "350") int size) {

        // Validate user ownership of link
        LinkResponse link = linkService.getLinkById(id);

        int dimension = Math.min(Math.max(size, 150), 1000);
        byte[] qrBytes = qrCodeService.generateQrCodePng(link.getShortUrl(), dimension, dimension);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"linkforge-qr-" + link.getShortCode() + ".png\"")
                .body(qrBytes);
    }
}
