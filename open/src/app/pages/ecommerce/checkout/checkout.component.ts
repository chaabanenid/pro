import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
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
  loading=false;
  submit;
  displayToast=false;

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
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been saved',
      showConfirmButton: false,
      timer: 1000,
    });
  }
  positionError() {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Event Error',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  validSubmit() {
    this.submit = true;
    this.loading=true;
    const userId = JSON.parse(localStorage.getItem("currentUser"));
    //réquést
    this.http
      .post<any>(`http://localhost:8080/api/reclamation/add`, {
        ...this.productForm.value,
        userId: userId._id,
      })
      .subscribe((data) => {
        if(data.success){
          this.loading=false;
          this.position()
        }
       
        return data;
      },
      (err) => {this.positionError()
      this.loading=false;
      },
      )
      
      ;
  }
}
