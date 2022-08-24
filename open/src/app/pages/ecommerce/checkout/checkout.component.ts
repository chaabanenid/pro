import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})

/**
 * Ecommerce checkout component
 */
export class CheckoutComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  selectValue = [];
  stateValue = [];
  submit;

  constructor(public formBuilder: FormBuilder, private http: HttpClient) {}
  get form() {
    return this.productForm.controls;
  }

  productForm: FormGroup;
  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9]+")]],
      description: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z0-9]+")],
      ],
      type: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9]+")]],
      confidence: ["", [Validators.required]],
      author: ["", [Validators.required]],
      references: ["", [Validators.required]],
    });
    this.submit = false;

    this.breadCrumbItems = [
      { label: "Ecommerce" },
      { label: "Checkout", active: true },
    ];

    this.selectValue = [
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

    this.stateValue = ["None", "Low", "Moderate", "Good", "Strong"];
  }

  validSubmit() {
    this.submit = true;

    const userId = JSON.parse(localStorage.getItem("currentUser"));
    //réquést
    this.http
      .post<any>(`http://localhost:8080/api/reclamation/add`, {
        ...this.productForm.value,
        userId: userId._id,
      })
      .subscribe((data) => {
        console.log("réturn");
        return data;
      });
  }
}
