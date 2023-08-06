package com.bitproject.techbeats.item;

import com.bitproject.techbeats.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "item_brand_has_item_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemBrandHasItemCategory implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn(name = "item_brand_id",referencedColumnName = "id")
    private ItemBrand item_brand_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "item_category_id",referencedColumnName = "id")
    private ItemCategory item_category_id;
}
