import React from "react";
import { Form } from "semantic-ui-react";
import FileUploadField from "./FileUploadField";

const CollectionHighlightsForm = props => {
  const items = props.highlightsList.map((obj, index) => {
    return (
      <Form id={`collectionHighlight${index}_form`} key={index}>
        <legend>Highlight {index + 1}:</legend>
        <section>
          <FileUploadField
            value={obj.src}
            label="Upload file: (Image file only):"
            name={`collectionHighlights_${index}`}
            placeholder="Enter image source"
            site={props.site}
            filepath="highlights"
            setSrc={props.updateInputValue}
          />
          <label htmlFor={`highlight${index}_title`}>Title</label>
          <input
            id={`highlight${index}_title`}
            value={obj.title}
            name="title"
            placeholder="Enter the title for the highlight."
            onChange={props.updateItemValue("collectionHighlights", index)}
            data-index={index}
          />
          <label htmlFor={`highlight${index}_link`}>Link</label>
          <input
            id={`highlight${index}_link`}
            value={obj.link}
            name="link"
            placeholder="Enter the link for the highlight"
            onChange={props.updateItemValue("collectionHighlights", index)}
            data-index={index}
          />
          <label htmlFor={`highlight${index}_count`}>Item Count</label>
          <input
            id={`highlight${index}_count`}
            value={obj.itemCount}
            name="itemCount"
            placeholder="Enter the item count for this highlight"
            onChange={props.updateItemValue("collectionHighlights", index)}
            data-index={index}
          />
          <button
            onClick={props.removeItem("collectionHighlights", index)}
            data-index={index}
          >
            Remove highlight
          </button>
        </section>
      </Form>
    );
  });
  return (
    <div>
      <h2>Collection Highlights</h2>
      <button
        aria-label="Add a collection highlight"
        onClick={props.addItem("collectionHighlights")}
      >
        <i className="fas fa-plus"></i>
      </button>
      {items}
    </div>
  );
};

const CollectionHighlights = props => {
  const fields = props.highlightsList.map((obj, index) => {
    return (
      <div key={`field_${index}`} className="p-1">
        <strong>Collection Highlight {index + 1}</strong>
        <br />
        <p>
          <span className="key">Image Source:</span> {obj.src}
        </p>
        <p>
          <span className="key">Title:</span> {obj.title}
        </p>
        <p>
          <span className="key">Link:</span> {obj.link}
        </p>
        <p>
          <span className="key">Item Count:</span> {obj.itemCount}
        </p>
      </div>
    );
  });
  return fields;
};

export { CollectionHighlightsForm, CollectionHighlights };
