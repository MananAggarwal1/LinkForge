package com.linkforge.dto.analytics;

public class ClickStatItem {

    private String name;
    private long count;
    private double percentage;

    public ClickStatItem() {
    }

    public ClickStatItem(String name, long count) {
        this.name = name;
        this.count = count;
    }

    public ClickStatItem(String name, long count, double percentage) {
        this.name = name;
        this.count = count;
        this.percentage = percentage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
