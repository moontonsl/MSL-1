// Step3GameDetails.jsx
import React, { useState } from "react";

const Step3GameDetails = ({
  formData,
  handleInputChange,
  handleSubmit,
  errorMessage,
  setErrorMessage // <-- make sure this is passed as a prop
}) => {
  const [localError, setLocalError] = useState("");

  const validateForm = () => {
    const requiredFields = [
      "userId",
      "serverId",
      "rank",
      "inGameRole",
      "mainHero"
    ];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        setLocalError("⚠️ Please fill in all the required fields.");
        if (setErrorMessage) setErrorMessage("⚠️ Please fill in all the required fields.");
        return false;
      }
    }
    setLocalError("");
    if (setErrorMessage) setErrorMessage("");
    return true;
  };

  const handleAnyInputBlur = () => {
    validateForm();
  };

  return (
    <div className="">
      <h1 className="title-register">CREATE MSL ACCOUNT</h1>
      <h2 className="subtitle-register">MLBB DETAILS</h2>

      {/* Dynamic Progress Bar for Step 3 */}
      {(() => {
        const requiredFields = [
          "userId",
          "serverId",
          "rank",
          "inGameRole",
          "mainHero"
        ];
        const filled = requiredFields.filter(
          (field) => formData[field] && formData[field].toString().trim() !== ""
        ).length;
        // Progress goes from 51% to 75% as fields are filled
        const percent = 51 + Math.round((filled / requiredFields.length) * (75 - 51));

        return (
          <div style={{ margin: "16px 0" }}>
            <div style={{
              height: "12px",
              background: "#eee",
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "4px"
            }}>
              <div style={{
                width: `${percent}%`,
                height: "100%",
                background: "#f1c40f",
                transition: "width 0.3s"
              }} />
            </div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              Step 3 of 4 &mdash; {percent}% of this step complete
            </div>
          </div>
        );
      })()}

      <form className="form-register" onSubmit={handleSubmit}>
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="userId" className="label-register">
              User ID<span className="required"> *</span>
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              inputMode="numeric"
              pattern="\d*"
              value={formData.userId}
              onChange={handleInputChange}
              className="input-field-register"
              required
              onKeyPress={e => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              onPaste={e => {
                const pasted = e.clipboardData.getData('Text');
                if (!/^\d+$/.test(pasted)) e.preventDefault();
              }}
              onBlur={handleAnyInputBlur}
            />
          </div>
          <div className="input-group-register right-side-register">
            <label htmlFor="serverId" className="label-register">
              MLBB Server ID<span className="required"> *</span>
            </label>
            <input
              type="text"
              id="serverId"
              name="serverId"
              inputMode="numeric"
              pattern="\d*"
              value={formData.serverId}
              onChange={handleInputChange}
              className="input-field-register"
              placeholder="e.g. 12345"
              required
              onKeyPress={e => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              onPaste={e => {
                const pasted = e.clipboardData.getData('Text');
                if (!/^\d+$/.test(pasted)) e.preventDefault();
              }}
              onBlur={handleAnyInputBlur}
            />
          </div>
        </div>
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="ign" className="label-register">
              IGN (Automated)
            </label>
            <input
              type="text"
              id="ign"
              name="ign"
              value="THISISMYAUTOMATEDIGN"
              className="input-field-register"
              readOnly
            />
          </div>
          <div className="input-group-register right-side-register">
            <label htmlFor="squadName" className="label-register">
              MLBB Squad Name
            </label>
            <input
              type="text"
              id="squadName"
              name="squadName"
              value={formData.squadName}
              onChange={handleInputChange}
              className="input-field-register"
              placeholder="e.g. Legends Squad"
            />
          </div>
        </div>
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="squadAbbreviation" className="label-register">
              Squad Abbreviation
            </label>
            <input
              type="text"
              id="squadAbbreviation"
              name="squadAbbreviation"
              value={formData.squadAbbreviation}
              onChange={handleInputChange}
              className="input-field-register"
              placeholder="e.g. El Fili Esports"
            />
          </div>
          <div className="input-group-register right-side-register">
            <label htmlFor="rank" className="label-register">
              Current Rank<span className="required"> *</span>
            </label>
            <select
              id="rank"
              name="rank"
              value={formData.rank}
              onChange={handleInputChange}
              className="input-field-register current-rank-select"
              required
              onBlur={handleAnyInputBlur}
            >
              <option value="" disabled>Select Ranking</option>
              <option value="Warrior">Warrior</option>
              <option value="Elite">Elite</option>
              <option value="Master">Master</option>
              <option value="Grandmaster">Grandmaster</option>
              <option value="Epic">Epic</option>
              <option value="Legend">Legend</option>
              <option value="Mythic">Mythic</option>
              <option value="Mythical Glory">Mythical Honor</option>
              <option value="Mythical Glory">Mythical Glory</option>
              <option value="Mythical Glory">Mythical Immortal</option>
            </select>
          </div>
        </div>
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="inGameRole" className="label-register">
              In-Game Role<span className="required"> *</span>
            </label>
            <select
              id="inGameRole"
              name="inGameRole"
              value={formData.inGameRole}
              onChange={handleInputChange}
              className="input-field-register in-game-role-select"
              required
              onBlur={handleAnyInputBlur}
            >
              <option value="" disabled>Select Role</option>
              <option value="Tank">Tank</option>
              <option value="Support">Support</option>
              <option value="Marksman">Marksman</option>
              <option value="Mage">Mage</option>
              <option value="Assassin">Assassin</option>
              <option value="Fighter">Fighter</option>
            </select>
          </div>
          <div className="input-group-register right-side-register">
            <label htmlFor="mainHero" className="label-register">
              Main Hero<span className="required"> *</span>
            </label>
            <select
              id="mainHero"
              name="mainHero"
              value={formData.mainHero}
              onChange={handleInputChange}
              className="input-field-register main-hero-select"
              required
              onBlur={handleAnyInputBlur}
            >
              <option value="" disabled>Select Hero</option>
              <option value="Aamon">Aamon</option>
              <option value="Akai">Akai</option>
              <option value="Aldous">Aldous</option>
              <option value="Alice">Alice</option>
              <option value="Alpha">Alpha</option>
              <option value="Alucard">Alucard</option>
              <option value="Angela">Angela</option>
              <option value="Argus">Argus</option>
              <option value="Arlott">Arlott</option>
              <option value="Atlas">Atlas</option>
              <option value="Aurora">Aurora</option>
              <option value="Badang">Badang</option>
              <option value="Balmond">Balmond</option>
              <option value="Barats">Barats</option>
              <option value="Baxia">Baxia</option>
              <option value="Beatrix">Beatrix</option>
              <option value="Belerick">Belerick</option>
              <option value="Benedetta">Benedetta</option>
              <option value="Brody">Brody</option>
              <option value="Bruno">Bruno</option>
              <option value="Carmilla">Carmilla</option>
              <option value="Cecilion">Cecilion</option>
              <option value="Chang'e">Chang'e</option>
              <option value="Chou">Chou</option>
              <option value="Clint">Clint</option>
              <option value="Cyclops">Cyclops</option>
              <option value="Diggie">Diggie</option>
              <option value="Dyrroth">Dyrroth</option>
              <option value="Edith">Edith</option>
              <option value="Esmeralda">Esmeralda</option>
              <option value="Estes">Estes</option>
              <option value="Eudora">Eudora</option>
              <option value="Fanny">Fanny</option>
              <option value="Faramis">Faramis</option>
              <option value="Floryn">Floryn</option>
              <option value="Freya">Freya</option>
              <option value="Gatotkaca">Gatotkaca</option>
              <option value="Gloo">Gloo</option>
              <option value="Gord">Gord</option>
              <option value="Granger">Granger</option>
              <option value="Grock">Grock</option>
              <option value="Guinevere">Guinevere</option>
              <option value="Gusion">Gusion</option>
              <option value="Hanabi">Hanabi</option>
              <option value="Hanzo">Hanzo</option>
              <option value="Harith">Harith</option>
              <option value="Harley">Harley</option>
              <option value="Hayabusa">Hayabusa</option>
              <option value="Helcurt">Helcurt</option>
              <option value="Hilda">Hilda</option>
              <option value="Hylos">Hylos</option>
              <option value="Irithel">Irithel</option>
              <option value="Jawhead">Jawhead</option>
              <option value="Johnson">Johnson</option>
              <option value="Joy">Joy</option>
              <option value="Julian">Julian</option>
              <option value="Kadita">Kadita</option>
              <option value="Kagura">Kagura</option>
              <option value="Kaja">Kaja</option>
              <option value="Karina">Karina</option>
              <option value="Karrie">Karrie</option>
              <option value="Khaleed">Khaleed</option>
              <option value="Khufra">Khufra</option>
              <option value="Kimmy">Kimmy</option>
              <option value="Lancelot">Lancelot</option>
              <option value="Lapu-Lapu">Lapu-Lapu</option>
              <option value="Layla">Layla</option>
              <option value="Leomord">Leomord</option>
              <option value="Lesley">Lesley</option>
              <option value="Ling">Ling</option>
              <option value="Lolita">Lolita</option>
              <option value="Lunox">Lunox</option>
              <option value="Luo Yi">Luo Yi</option>
              <option value="Lylia">Lylia</option>
              <option value="Martis">Martis</option>
              <option value="Mathilda">Mathilda</option>
              <option value="Melissa">Melissa</option>
              <option value="Minsitthar">Minsitthar</option>
              <option value="Minotaur">Minotaur</option>
              <option value="Moskov">Moskov</option>
              <option value="Natalia">Natalia</option>
              <option value="Natan">Natan</option>
              <option value="Novaria">Novaria</option>
              <option value="Odette">Odette</option>
              <option value="Paquito">Paquito</option>
              <option value="Pharsa">Pharsa</option>
              <option value="Phoveus">Phoveus</option>
              <option value="Popol and Kupa">Popol and Kupa</option>
              <option value="Rafaela">Rafaela</option>
              <option value="Roger">Roger</option>
              <option value="Ruby">Ruby</option>
              <option value="Saber">Saber</option>
              <option value="Selena">Selena</option>
              <option value="Silvanna">Silvanna</option>
              <option value="Sun">Sun</option>
              <option value="Terizla">Terizla</option>
              <option value="Thamuz">Thamuz</option>
              <option value="Tigreal">Tigreal</option>
              <option value="Vale">Vale</option>
              <option value="Valentina">Valentina</option>
              <option value="Valir">Valir</option>
              <option value="Vexana">Vexana</option>
              <option value="Wanwan">Wanwan</option>
              <option value="X.Borg">X.Borg</option>
              <option value="Xavier">Xavier</option>
              <option value="Yin">Yin</option>
              <option value="Yi Sun-shin">Yi Sun-shin</option>
              <option value="Yve">Yve</option>
              <option value="Yu Zhong">Yu Zhong</option>
              <option value="Zhask">Zhask</option>
              <option value="Zilong">Zilong</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step3GameDetails;
