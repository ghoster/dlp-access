import React from "react";
import { Form } from "semantic-ui-react";
import FileUploadField from "./FileUploadField";

const FeaturedItemsForm = props => {
  const items = props.itemList.map((obj, index) => {
    return (
      <Form id={`featuredItem${index}_form`} key={index}>
        <legend>Item {index + 1}:</legend>
        <section>
          <FileUploadField
            value={obj.src}
            label="Upload file: (Image file only):"
            name={`featuredItems_${index}`}
            placeholder="Enter Src"
            site={props.site}
            filepath="featuredItems"
            setSrc={props.updateInputValue}
          />
          <label htmlFor={`FI${index}_alt`}>Alt Text</label>
          <input
            id={`FI${index}_alt`}
            value={obj.altText}
            name="altText"
            placeholder="Enter the alternative text for the image"
            onChange={props.updateItemValue("featuredItems", index)}
            data-index={index}
          />
          <label htmlFor={`FI${index}_title`}>Title</label>
          <input
            id={`FI${index}_title`}
            value={obj.cardTitle}
            name="cardTitle"
            placeholder="Enter the title for the item"
            onChange={props.updateItemValue("featuredItems", index)}
            data-index={index}
          />
          <label htmlFor={`FI${index}_link`}>URL</label>
          <input
            id={`FI${index}_link`}
            value={obj.link}
            name="link"
            placeholder="Enter the URL for the item"
            onChange={props.updateItemValue("featuredItems", index)}
            data-index={index}
          />
          <button
            onClick={props.removeItem("featuredItems", index)}
            data-index={index}
          >
            Remove item
          </button>
        </section>
      </Form>
    );
  });
  return (
    <div>
      <h2>Featured Items</h2>
      <button
        aria-label="Add a featured item"
        onClick={props.addItem("featuredItems")}
      >
        <i className="fas fa-plus"></i>
      </button>
      {items}
    </div>
  );
};

const FeaturedItems = props => {
  const fields = props.itemList.map((obj, index) => {
    return (
      <div key={`field_${index}`} className="p-1">
        <strong>Featured Item {index + 1}</strong>
        <br />
        <p>
          <span className="key">Source:</span> {obj.src}
        </p>
        <p>
          <span className="key">Alt text:</span> {obj.altText}
        </p>
        <p>
          <span className="key">Title:</span> {obj.cardTitle}
        </p>
        <p>
          <span className="key">URL:</span> {obj.link}
        </p>
      </div>
    );
  });
  return fields;
};

export { FeaturedItemsForm, FeaturedItems };
