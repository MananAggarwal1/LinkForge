package com.linkforge.dto.link;

public class RedirectResult {

    private String destinationUrl;
    private boolean passwordRequired;
    private String shortCode;
    private String title;

    public RedirectResult() {
    }

    public static RedirectResult direct(String destinationUrl) {
        RedirectResult result = new RedirectResult();
        result.setDestinationUrl(destinationUrl);
        result.setPasswordRequired(false);
        return result;
    }

    public static RedirectResult passwordRequired(String shortCode, String title) {
        RedirectResult result = new RedirectResult();
        result.setShortCode(shortCode);
        result.setTitle(title);
        result.setPasswordRequired(true);
        return result;
    }

    public String getDestinationUrl() {
        return destinationUrl;
    }

    public void setDestinationUrl(String destinationUrl) {
        this.destinationUrl = destinationUrl;
    }

    public boolean isPasswordRequired() {
        return passwordRequired;
    }

    public void setPasswordRequired(boolean passwordRequired) {
        this.passwordRequired = passwordRequired;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
