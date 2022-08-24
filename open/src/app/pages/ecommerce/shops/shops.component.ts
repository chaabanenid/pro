import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

import { shopsData } from "./data";

import { Shops } from "./shops.model";

@Component({
  selector: "app-shops",
  templateUrl: "./shops.component.html",
  styleUrls: ["./shops.component.scss"],
})

/**
 * Ecommerce Shops component
 */
export class ShopsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  shopsData: Shops[];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Ecommerce" },
      { label: "Shops", active: true },
    ];

    /**
     * fetches data
     */
    this._fetchData();
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.http
      .get<any>(`http://localhost:8080/api/reclamation/getAll`)
      .subscribe((data) => {
        console.log("data", data.users);
        this.shopsData = data.users;
      });
  }
}
