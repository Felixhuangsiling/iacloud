// src/ImageUpload.tsx
import React, { useState, useMemo } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Slider, SliderValue,
  Switch,
} from "@nextui-org/react";
import { useWatterCropPrediction } from "./AIService.ts";
import Hearth from "./assets/hearth.svg?react";
import Expert from "./assets/expert.svg?react";
import Rain from "./assets/rain.svg?react";
import Sun from "./assets/sun.svg?react";
import Wind from "./assets/wind.svg?react";
import Cloud from "./assets/cloud.svg?react";
import Humid from "./assets/humid.svg?react";
import SemiHumid from "./assets/semi-humid.svg?react";
import Arid from "./assets/arid.svg?react";
import SemiArid from "./assets/semi-arid.svg?react";
import Dry from "./assets/dry.svg?react";
import Wet from "./assets/wet.svg?react";
import Plant from "./assets/plant.svg?react";


interface CropWaterRequirementFormProps {
  expertMode: boolean;
  version: "version1" | "version2";
}

const cropType = [
  { key: "BANANA", label: "Bananes" },
  { key: "SOYABEAN", label: "Soja" },
  { key: "CABBAGE", label: "Chou" },
  { key: "POTATO", label: "Pomme de terre" },
  { key: "RICE", label: "Riz" },
  { key: "MELON", label: "Melon" },
  { key: "MAIZE", label: "Maïs" },
  { key: "CITRUS", label: "Citron" },
  { key: "BEAN", label: "Haricot" },
  { key: "WHEAT", label: "Blé" },
  { key: "MUSTARD", label: "Moutarde" },
  { key: "COTTON", label: "Coton" },
  { key: "SUGARCANE", label: "Canne à sucre" },
  { key: "TOMATO", label: "Tomate" },
  { key: "ONION", label: "Onion" },
];

export default function CropWaterRequirement() {
  const [isSelected, setIsSelected] = useState<boolean>(true);

  return (
    <div className="flex flex-col justify-center gap-10 m-20">
      <div className="flex flex-row flex-1">
        <Switch
          isSelected={isSelected}
          onValueChange={(isSelected) => setIsSelected(isSelected)}
          color="success"
          size="lg"
          thumbIcon={({ isSelected, className }) =>
            isSelected ? (
              <Expert heigth="1em" width="1em" className={className} />
            ) : (
              <Hearth heigth="1em" width="1em" className={className} />
            )
          }
        >
          {isSelected ? "Mode Expert" : "Mode Simplifié"}
        </Switch>
      </div>
      <div className="flex w-full flex-col items-center">
        <Tabs aria-label="Options">
          <Tab key="v1" title="Version 1" className="w-full">
            <CropWaterRequirementForm
              version="version1"
              expertMode={isSelected}
            />
          </Tab>
          <Tab key="v2" title="Version 2" className="w-full">
            <CropWaterRequirementForm
              version="version2"
              expertMode={isSelected}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

function CropWaterRequirementForm({
  version,
  expertMode,
}: CropWaterRequirementFormProps) {
  const [value, setValue] = React.useState(new Set<string>([]));
  const [soilType, setSoliType] = useState("WET");
  const [region, setRegion] = useState("SEMI-ARID");
  const [tempRange, setTempRange] = useState([20, 30]);
  const [temp, setTemp] = useState(10);
  const [climatCondition, setClimatCondition] = useState("SUNNY");
  const [waterPrediction, setWaterPrediction] = useState<null | number>(null);

  const watterCropPrediction = useWatterCropPrediction();

  const canSend = useMemo(() => value.size > 0, [value]);
  const handleEasySend = () => {};

  const handleSliderChange = (value: SliderValue) =>{
    if((typeof value) === "number")
      return

    const newTemp = value as number[];

    if(tempRange[0] === newTemp[0])
    {
      if(tempRange[1] < newTemp[1])
        setTempRange([...tempRange.map(t => t + 10)]);
      else
        setTempRange([...tempRange.map(t => t - 10)]);
    }
    else if (tempRange[1] === newTemp[1])
    {
      if(tempRange[0] < newTemp[0])
        setTempRange([...tempRange.map(t => t + 10)]);
      else
        setTempRange([...tempRange.map(t => t - 10)]);
    }



  }
  const handleExpertSend = async () => {
    const cropTypeIt = value.values();
    const cropType = cropTypeIt.next().value!;

    if (version === "version1") {
      const data = {
        cropType: cropType,
        soilType: soilType,
        region: region,
        temperature: tempRange.join("-"),
        weatherCondition: climatCondition,
      };

      const res = await watterCropPrediction.getAiPredictionV1(data);
      if (res) setWaterPrediction(res);
    } else {
      const data = {
        cropType: cropType,
        soilType: soilType,
        region: region,
        temperature: temp,
        weatherCondition: climatCondition,
      };
      const res = await watterCropPrediction.getAiPredictionV2(data);
      if (res) setWaterPrediction(res);
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
        <h4 className="font-bold text-large text-center">
          Veuillez completer les informations
        </h4>
      </CardHeader>
      <CardBody className="flex flex-col gap-5">
        <Select
          labelPlacement="outside"
          className="max-w-xs"
          variant="bordered"
          items={cropType}
          selectedKeys={value}
          onSelectionChange={setValue}
          label={<span className="flex inline-flex flex-row">Type de plantation <Plant/></span>}
          placeholder="Selectionnez un type"
        >
          {(crop) => <SelectItem>{crop.label}</SelectItem>}
        </Select>
        <RadioGroup
          label="Type de sol"
          orientation="horizontal"
          value={soilType}
          onValueChange={setSoliType}
        >
          <Radio value="HUMID" description="Humide"><Humid/></Radio>
          <Radio value="WET" description="Mouillé"><Wet/></Radio>
          <Radio value="DRY" description="Sec"><Dry/></Radio>
        </RadioGroup>
        <RadioGroup
          label="Region"
          orientation="horizontal"
          value={region}
          onValueChange={setRegion}
        >
          <Radio value="DESERT" description="Désertique"><Arid/></Radio>
          <Radio value="SEMI-ARID" description="Semi-aride"><SemiArid/></Radio>
          <Radio value="HUMID" description="Humide"><Humid/></Radio>
          <Radio value="SEMI-HUMID" description="Semi-humide"><SemiHumid/></Radio>
        </RadioGroup>
        {version === "version1" ? (
          <Slider
            className="max-w-md"
            defaultValue={[20, 30]}
            value={tempRange}
            onChangeEnd={handleSliderChange}
            formatOptions={{unit: "degree", style: 'unit', unitDisplay: 'narrow'}}
            label="Température"
            maxValue={50}
            minValue={10}
            showSteps={true}
            step={10}
          />
        ) : (
          <Slider
            className="max-w-md"
            defaultValue={10}
            value={temp}
            onChange={setTemp}
            label="Température"
            maxValue={50}
            minValue={10}
            showSteps={true}
            step={1}
          />
        )}

        <RadioGroup
          label="Condition climatique"
          orientation="horizontal"
          value={climatCondition}
          onValueChange={setClimatCondition}
        >
          <Radio value="SUNNY" description="Ensoleillé"><Sun/></Radio>
          <Radio value="NORMAL" description="Normal"><Cloud/></Radio>
          <Radio value="RAINY" description="Pluvieux"><Rain/></Radio>
          <Radio value="WINDY" description="Venteux"><Wind/></Radio>
        </RadioGroup>
      </CardBody>
      <CardFooter className="flex flex-col gap-4">
        <Button
          color="primary"
          isDisabled={!canSend}
          isLoading={watterCropPrediction.isLoading}
          onPress={handleExpertSend}
        >
          Calculer la fraicheur
        </Button>
        {waterPrediction !== null && (
          <Chip color="success">Besoin en eau (L): {waterPrediction}</Chip>
        )}
      </CardFooter>
    </Card>
  );
}
