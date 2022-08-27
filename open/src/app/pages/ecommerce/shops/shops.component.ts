import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
  stateValue = ["None", "Low", "Moderate", "Good", "Strong"];
  selectValue = [
    "adware",
    "backdoor",
    "bot",
    "boot kit",
    "ddos",
    "downoader",
    "dropper",
    "exploit-kit",
    "keylogger",
    "ransomware",
    "remote-access-trojen",
    "resource-exploitation",
    "rogue-security-software",
    "root-kit",
    "screen-capture",
    "spyware",
    "trojan",
    "Undefined",
    "virus",
    "webshell",
    "wiper",
    "worm",
  ];
  constructor(private http: HttpClient, private modalService: NgbModal, private formBuilder: FormBuilder) { }
  formData: FormGroup;
  submitted = false;
  role;
  ngOnInit() {
    var values = JSON.parse(localStorage.getItem("currentUser"));
    console.log("local", values.role)
    this.role = values.role

    this.breadCrumbItems = [
      { label: "Ecommerce" },
      { label: "Shops", active: true },
    ];

    this.formData = this.formBuilder.group({
      name: ["", [Validators.required,]],
      description: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z0-9]+")],
      ],
      type: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9]+")]],
      confidence: ["", [Validators.required]],
      author: ["", [Validators.required]],
      references: ["", [Validators.required]],
      _id: ["",],
    });
    /**
     * fetches data
     */
    this._fetchData();
  }
  get form() {
    return this.formData.controls;
  }


  openModal(content: any, data) {
    console.log(data)

    this.formData.setValue({
      author: data.author, description: data.description,
      _id: data._id,
      confidence: data.confidence, name: data.name, references: data.references, type: data.type

    })
    this.modalService.open(content);
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    if (this.role !== 'admin') {
      var values = JSON.parse(localStorage.getItem("currentUser"));
      this.http
        .get<any>(`http://localhost:8080/api/reclamation/getById/` + values._id)
        .subscribe((data) => {
          console.log("data", data.users);
          this.shopsData = data.rec;
        });

    }
    else
      this.http
        .get<any>(`http://localhost:8080/api/reclamation/getAll`)
        .subscribe((data) => {
          console.log("data", data.users);
          this.shopsData = data.users;
        });
  }
  deleteReclamation(id) {
    this.http
      .delete<any>(`http://localhost:8080/api/reclamation/delete/` + id)
      .subscribe((data) => {
        console.log("data", data.users);
       this._fetchData();
      });

  }
  saveCustomer() {
    if (this.formData.valid) {
      console.log("id", this.formData.value._id)
      let id = this.formData.value._id
      this.http
        .patch<any>(`http://localhost:8080/api/reclamation/update/` + id, {
          ...this.formData.value,
        })
        .subscribe((data) => {
          this._fetchData()
          return data;
        });



      this.modalService.dismissAll()
    }
    this.submitted = true
  }

}
