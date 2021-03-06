function GUI() {
    this.heart = getLoadedImage("assets/icon/heart.png");
    this.slot = getLoadedImage("assets/icon/slot.png");

    this.healthSize = scl;
    this.slotSize = scl * 1.25;
    this.itemSize = scl;

    this.show = function() {
        for (i = 0; i < player.health; i++) {
            image(this.heart, scl * i, 0, this.healthSize, this.healthSize);
        }

        for (i = 0; i < player.inventory.items.length; i++) {
            image(this.slot, width - this.slotSize * i - this.slotSize, 0, this.slotSize, this.slotSize);
            image(player.inventory.items[i].img, width - this.slotSize * i - this.slotSize + (this.slotSize - this.itemSize) * 0.5, (this.slotSize - this.itemSize) * 0.5, this.itemSize, this.itemSize);
        }

        image(getLoadedImage(barPath + level.bar), scl / 4, height - scl + scl / 3, scl * 4, scl * 0.5);

        fill(255);

        //console.log("map start = " + map.start + ", playerx/scl = " + (player.x / scl) + ", level length = " + level.length);
        var barX = (((player.x / scl) + map.start) / level.length) * scl * 4;



        rect(scl / 4 + barX, height - scl + scl / 3, scl / 10, scl * 0.5);
    }

    this.scale = function() {
        this.healthSize = scl / oldScl * this.healthSize;
        this.slotSize = scl / oldScl * this.slotSize;
        this.itemSize = scl / oldScl * this.itemSize;
    }
}
