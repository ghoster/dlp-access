import React from "react";
import { Form } from "semantic-ui-react";
import FileUploadField from "./FileUploadField";

const SponsorForm = props => {
  const sponsors = props.sponsorsList.map((obj, index) => {
    return (
      <Form id={`sponsor${index}_form`} key={index}>
        <legend>Sponsor {index + 1}:</legend>
        <section>
          <FileUploadField
            value={obj.src}
            label="Upload file: (Image file only):"
            name={`sponsors_${index}`}
            placeholder="Enter Src"
            site={props.site}
            filepath="sponsors"
            setSrc={props.updateInputValue}
          />
          <label htmlFor={`s${index}_alt`}>Alt Text</label>
          <input
            id={`s${index}_alt`}
            value={obj.alt}
            name="alt"
            placeholder="Enter the sponsor's name"
            onChange={props.updateItemValue("sponsors", index)}
            data-index={index}
          />
          <label htmlFor={`s${index}_link`}>URL</label>
          <input
            id={`s${index}_link`}
            value={obj.link}
            name="link"
            placeholder="Enter the URL for the sponsor"
            onChange={props.updateItemValue("sponsors", index)}
            data-index={index}
          />
          <button
            onClick={props.removeItem("sponsors", index)}
            data-index={index}
          >
            Remove sponsor
          </button>
        </section>
      </Form>
    );
  });
  return (
    <div>
      <h2>Sponsors</h2>
      <button aria-label="Add sponsor" onClick={props.addItem("sponsors")}>
        <i className="fas fa-plus"></i>
      </button>
      {sponsors}
    </div>
  );
};

const Sponsors = props => {
  const fields = props.sponsorsList.map((obj, index) => {
    return (
      <div key={`field_${index}`} className="p-1">
        <strong>Sponsor {index + 1}</strong>
        <br />
        <p>
          <span className="key">Source:</span> {obj.src}
        </p>
        <p>
          <span className="key">Alt text:</span> {obj.alt}
        </p>

        <p>
          <span className="key">URL:</span> {obj.link}
        </p>
      </div>
    );
  });
  return fields;
};

export { SponsorForm, Sponsors };
